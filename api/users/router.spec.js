'use strict';
const Server = require('../../app/server');
const server = new Server(false).start();

const { describe, it } = require('mocha');
const assert = require('assert');
const supertest = require('supertest');
const faker = require('faker');

const db = require('../../app/database');
const h = require('../../helpers');

describe('UserController', () => {

    it('create user validation email', async () => {
        // arrange
        const user =  {
            name: faker.name.findName(),
            email: 'bad-string-email',
            password: faker.internet.password(),
            active: true
        };
        // act
        const res = await this.createUser(user);
        // assert
        assert(res.error);
        assert(res.error.length > 0);
        assert(res.error[0].message === 'should match format "email"');
    });

    it('create user', async () => {
        // arrange
        const user =  {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            active: true
        };
        // act
        const res = await this.createUser(user);
        // assert
        assert(res.message === 'User created');
        assert(res.data.insertId > 0);
    });

    it('valid user password && password_salt', async () => {
        // arrange
        const user = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            active: true
        };
        // act
        const res = await this.createUser(user);
        const userId = res.data.insertId;
        // assert
        return new Promise(async (resolve, reject) => {
            try {
                const rows = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
                assert(rows.length > 0);
                const userInserted = rows[0];
                const uuidv4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
                assert(userInserted.password_salt.match(uuidv4));
                assert(userInserted.password === h.crypto.Password(user.password, userInserted.password_salt));
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });

    it('read user success', async () => {
        // arrange
        const user = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            active: true
        };
        // act
        let res = await this.createUser(user);
        const userId = res.data.insertId;
        res = await this.readUser(userId);
        // assert
        assert(res.message === 'User found');
        assert(res.data.name === user.name);
        assert(res.data.email === user.email.toLowerCase().trim());
        assert(!!res.data.active === user.active);
    });

    it('read user fail', async () => {
        // act
        const res = await this.readUser(99999999);
        // assert
        assert(res.error === 'User not found');
    });

    it('list user', async () => {
        // act
        const res = await this.listUser();
        // assert
        assert(res.message === 'Listing users');
        assert(res.data.length > 0);
        assert(res.data[0].id);
        assert(res.data[0].name);
        assert(res.data[0].email);
        assert(res.data[0].password);
        assert(res.data[0].password_salt);
        assert(res.data[0].active);
    });

    it('update user', async () => {
        // arrange
        const user = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            active: true
        };
        const userChanges = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            active: false
        };
        // act
        let res = await this.createUser(user);
        const userId = res.data.insertId;
        res = await this.updateUser(userId, userChanges);
        // assert
        assert(res.message === 'User updated');
    });

    it('delete user', async () => {
        // arrange
        const user = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            active: true
        };
        // act
        let res = await this.createUser(user);
        const userId = res.data.insertId;
        res = await this.deleteUser(userId);
        // assert
        assert(res.message === 'User deleted');
    });

});

// spec functions
exports.createUser = (user) => new Promise((resolve, reject) => {
    supertest(server)
    .post('/api/users')
    .send(user)
    .set('Authorization', `Bearer ${h.jwt.sign()}`)
    .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
    });
});

exports.readUser = (userId) => new Promise((resolve, reject) => {
    supertest(server)
    .get('/api/users/'+userId)
    .set('Authorization', `Bearer ${h.jwt.sign()}`)
    .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
    });
});

exports.listUser = () => new Promise((resolve, reject) => {
    supertest(server)
    .get('/api/users/')
    .set('Authorization', `Bearer ${h.jwt.sign()}`)
    .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
    });
});

exports.updateUser = (userId, userChanges) => new Promise((resolve, reject) => {
    supertest(server)
    .put('/api/users/'+userId)
    .send(userChanges)
    .set('Authorization', `Bearer ${h.jwt.sign()}`)
    .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
    });
});

exports.deleteUser = (userId) => new Promise((resolve, reject) => {
    supertest(server)
    .delete('/api/users/'+userId)
    .set('Authorization', `Bearer ${h.jwt.sign()}`)
    .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
    });
});
