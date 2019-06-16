'use strict';
module.exports = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
        active: { type: "boolean", default: false },
    },
    required: [],
    additionalProperties: false,
};