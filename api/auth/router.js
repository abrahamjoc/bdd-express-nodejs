'use strict';
const express = require('express');
const controller = require('./controller');
const jwtMdw = require('../../app/middlewares/jwt-validator');
const mdwSVLogin = require('../../app/middlewares/schema-validator')('auth', 'authLogin');
const mdwSVChangePassword = require('../../app/middlewares/schema-validator')('auth', 'authChangePassword');

class UserRoutes {

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.post('/login', mdwSVLogin, controller.login);
        this.router.post('/change-password', jwtMdw, mdwSVChangePassword, controller.changePassword);
    }

}

module.exports = new UserRoutes().router;
