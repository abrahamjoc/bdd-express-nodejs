'use strict';
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET || 'secret-default';

class JWT {

    sign(data, timeSecs) {
        return jwt.sign(data || {}, jwtSecret, {
            expiresIn: timeSecs ? timeSecs : 60 * 60 * 24 // 24 hours default
        });
    }

    verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtSecret, (err, tokenData) => {
                if (err) reject(err);
                resolve(tokenData);
            })
        });
    }

    decode(token) {
        return jwt.decode(token);
    }
}

module.exports = new JWT();
