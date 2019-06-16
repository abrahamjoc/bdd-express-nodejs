'use strict';
exports.authLogin = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
    },
    required: ["email", "password"],
    additionalProperties: false,
};

exports.authChangePassword = {
    type: "object",
    properties: {
        newPassword: { type: "string", minLength: 6 },
    },
    required: ["newPassword"],
    additionalProperties: false,
};
