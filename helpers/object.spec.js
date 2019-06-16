'use strict';
const { describe, it } = require('mocha');
const assert = require('assert');
const objectHelper = require('./object');

describe('ObjectHelper', () => {

    it('removeKeys: remove specific keys', () => {
        const obj = {
            keepKey: 'Keep this key',
            deleteKey: 'Delete this key'
        };
        objectHelper.removeKeys(obj, 'deleteKey');
        assert(obj.keepKey);
        assert(obj.deleteKey === undefined);
    });

});
