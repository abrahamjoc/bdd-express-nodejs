'use strict';
const h = require('../../helpers');

class MiddlewareJWTValidator {

    mdwFunction() {
        return async (req, res, next) => {
            if (!req.headers.authorization)
                return res.replayErr("Authorization header is required", 400);
            if (!req.headers.authorization.includes('Bearer ', 0))
                return res.replayErr("Authorization format must be 'Bearer {token}'", 400);
            if (req.headers.authorization.trim().split(' ').length !== 2)
                return res.replayErr("Authorization format must be 'Bearer {token}'", 400);
            const token = req.headers.authorization.trim().split(' ')[1];
            try {
                await h.jwt.verify(token);
                next();
            } catch (err) {
                return res.replayErr(err.toString(), 400);
            }
        };
    };
}

module.exports = new MiddlewareJWTValidator().mdwFunction();
