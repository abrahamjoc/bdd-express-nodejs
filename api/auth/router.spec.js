'use strict';
const Server = require('../../app/server');
const server = new Server(false).start();

const { describe, it } = require('mocha');
const assert = require('assert');
const supertest = require('supertest');
const faker = require('faker');

const h = require('../../helpers');
const userSpec = require('../users/router.spec');

describe('AuthController', () => {

    it('login user validation email', async () => {
        // act
        const res = await this.loginUser({});
        // assert
        assert(res.error);
        assert(res.error.length > 0);
        assert(res.error[0].message === 'should have required property \'email\'');
    });

    it('login user validation password', async () => {
        // act
        const res = await this.loginUser({email: faker.internet.email()});
        // assert
        assert(res.error);
        assert(res.error.length > 0);
        assert(res.error[0].message === 'should have required property \'password\'');
    });

    it('login user success', async () => {
        // arrange
        const user =  {
            name: faker.name.findName(),
            email: faker.internet.email().toUpperCase(),
            password: faker.internet.password(),
            active: true
        };
        // act
        await userSpec.createUser(user);
        const res = await this.loginUser({ email: user.email, password: user.password });
        // assert
        assert(!res.error, JSON.stringify(res.error));
        assert(res.message, 'User found');
        assert(res.data.name === user.name);
        assert(res.data.email === user.email.toLowerCase());
        assert(!!res.data.active === user.active);
        assert(res.data.token);
    });

    it('login user password fail', async () => {
        // arrange
        const user =  {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            active: true
        };
        // act
        await userSpec.createUser(user);
        user.password = 'password-wrong';
        const res = await this.loginUser({ email: user.email, password: user.password });
        // assert
        assert(res.error === 'User password wrong');
    });

    it('login user and doesn\'t exist' , async () => {
        // arrange
        const user =  {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            active: true
        };
        // act
        await userSpec.createUser(user);
        user.email = 'email@wrong.com';
        const res = await this.loginUser({ email: user.email, password: user.password });
        // assert
        assert(res.error === 'User not found');
    });

    it('change password and user login success', async () => {
        // arrange
        const user =  {
            name: faker.name.findName(),
            email: faker.internet.email().toUpperCase(),
            password: faker.internet.password(),
            active: true
        };
        // act
        await userSpec.createUser(user);
        const res = await this.loginUser({ email: user.email, password: user.password });
        const userToken = res.data.token;
        const newPassword = faker.internet.password();
        const resChangePassword = await this.changePasswordUser(userToken, newPassword);
        const resLogin = await this.loginUser({ email: user.email, password: newPassword });
        // assert
        assert(!resChangePassword.error, JSON.stringify(res.error));
        assert(resChangePassword.message, 'User password updated successfully');
        assert(!resLogin.error, JSON.stringify(res.error));
        assert(resLogin.message, 'User found');
        assert(resLogin.data.name === user.name);
        assert(resLogin.data.email === user.email.toLowerCase());
        assert(!!resLogin.data.active === user.active);
        assert(resLogin.data.token);
    });

    it('change password and user login fail', async () => {
        // arrange
        const user =  {
            name: faker.name.findName(),
            email: faker.internet.email().toUpperCase(),
            password: faker.internet.password(),
            active: true
        };
        // act
        await userSpec.createUser(user);
        const res = await this.loginUser({ email: user.email, password: user.password });
        const userToken = res.data.token;
        const newPassword = faker.internet.password();
        const resChangePassword = await this.changePasswordUser(userToken, newPassword);
        const resLogin = await this.loginUser({ email: user.email, password: 'password-wrong' });
        // assert
        assert(!resChangePassword.error, JSON.stringify(res.error));
        assert(resChangePassword.message, 'User password updated successfully');
        assert(resLogin.error === 'User password wrong');
    });

    it('change password with jwt token expired', async () => {
        // arrange
        const userToken = h.jwt.sign({}, -1);
        // act
        const newPassword = faker.internet.password();
        const res = await this.changePasswordUser(userToken, newPassword);
        // assert
        assert(res.error);
        assert(res.error === 'TokenExpiredError: jwt expired');
    });

});

// spec functions
exports.loginUser = (user) => new Promise((resolve, reject) => {
    supertest(server)
    .post('/api/auth/login')
    .send(user)
    .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
    });
});

exports.changePasswordUser = (jwtToken, newPassword) => new Promise((resolve, reject) => {
    supertest(server)
    .post('/api/auth/change-password')
    .send({newPassword})
    .set('Authorization', `Bearer ${jwtToken}`)
    .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
    });
});
