'use strict';
const crypto = require('crypto');

class Crypto {

    Base64(str) {
        let buff = Buffer.from(str, 'utf8');
        return buff.toString('base64');
    }

    MD5(str) {
        const hash = crypto.createHash('md5');
        const data = hash.update(str, 'utf-8');
        return data.digest('hex');
    }

    SHA512(str) {
        const hash = crypto.createHash('sha512');
        const data = hash.update(str, 'utf-8');
        return data.digest('hex');
    }

    Password(password, salt) {
        return this.SHA512(this.MD5(salt) + this.Base64(password));
    }

}

module.exports = new Crypto();