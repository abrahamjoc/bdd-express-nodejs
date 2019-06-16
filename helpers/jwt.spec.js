'use strict';
const { describe, it } = require('mocha');
const assert = require('assert');
const jwtHelper = require('./jwt');

describe('JWTHelper', () => {

    it('sign successfully', () => {
        const token = jwtHelper.sign();
        const regexJwt = '^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*$';
        assert(new RegExp(regexJwt).test(token));
    });

    it('verify success', async () => {
        const token = jwtHelper.sign();
        const tokenVerify = await jwtHelper.verify(token);
        assert(tokenVerify.iat);
        assert(tokenVerify.exp);
    });

    it('verify fail', async () => {
        const token = jwtHelper.sign({}, -1);
        try {
            await jwtHelper.verify(token);
        } catch (err) {
            assert(err.name === 'TokenExpiredError');
            assert(err.message === 'jwt expired');
        }
    });

    it('decode successfully', () => {
        const tokenData = { testing: 'data' };
        const token = jwtHelper.sign(tokenData);
        const tokenDecoded = jwtHelper.decode(token);
        assert(tokenDecoded instanceof Object);
        assert(tokenDecoded.iat);
        assert(tokenDecoded.exp);
        assert(tokenDecoded.testing);
        assert(tokenDecoded.testing==='data');
    });

});
