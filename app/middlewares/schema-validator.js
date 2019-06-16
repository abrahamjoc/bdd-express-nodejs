'use strict';
const Ajv = require('ajv');

class MiddlewareSchemaValidator {

    constructor(schemaFolder, schemaName) {
        this.schema = schemaFolder;
        this.schemaKey = schemaName || '';
    }

    mdwFunction() {
        return (req, res, next) => {
            let schemaObject = require(`../../api/${this.schema}/schema`);
            if (this.schemaKey.length > 0) schemaObject = schemaObject[this.schemaKey];

            if (this.schemaKey.length > 0 && !schemaObject) console.error(`
                MiddlewareSchemaValidatorError: ${this.schemaKey} isn't a key of schema file.
                Schema key doesn't exist in schema file. Maybe, It's a module.exports instead exports.KEY-OBJECT.
                You must put code as exports.${this.schemaKey} = { ... }
                `
            );

            const ajv = new Ajv();
            const validate = ajv.compile(schemaObject);

            const valid = validate(req.body);
            if (!valid) return res.replayErr(validate.errors);

            next();
        }
    }

}

module.exports = (schemaFolder, schemaName) => new MiddlewareSchemaValidator(schemaFolder, schemaName).mdwFunction();
