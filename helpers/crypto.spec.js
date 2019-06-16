'use strict';
const { describe, it } = require('mocha');
const assert = require('assert');
const cryptoHelper = require('./crypto');

describe('CryptoHelper', () => {

    it('encrypt Base64 string', () => {
        const str = 'password';
        const hashResult = 'cGFzc3dvcmQ=';
        const strEncrypt = cryptoHelper.Base64(str);
        assert(strEncrypt.toLowerCase()===hashResult.toLowerCase());
    });

    it('encrypt MD5 string', () => {
        const str = 'password';
        const hashResult = '5f4dcc3b5aa765d61d8327deb882cf99';
        const strEncrypt = cryptoHelper.MD5(str);
        assert(strEncrypt.toLowerCase()===hashResult.toLowerCase());
    });

    it('encrypt SHA512 string', () => {
        const str = 'password';
        const hashResult = 'B109F3BBBC244EB82441917ED06D618B9008DD09B3BEFD1B5E07394C706A8BB980B1D7785E5976EC049B46DF5F1326AF5A2EA6D103FD07C95385FFAB0CACBC86';
        const strEncrypt = cryptoHelper.SHA512(str);
        assert(strEncrypt.toLowerCase()===hashResult.toLowerCase());
    });

    it('encrypt Password string', () => {
        const password = 'password';
        const salt = 'salt';
        const hashResult = 'a8e797bec5e484dddcae0a409c4e35f2f72245f663bbd68672d134ece357ab3f078b3b6a1ebadc412379df835bfe972dd948f9f92410b57fb2614f9e1f57e5eb';
        const strEncrypt = cryptoHelper.Password(password, salt);
        assert(strEncrypt.toLowerCase()===hashResult.toLowerCase());
    });

});
