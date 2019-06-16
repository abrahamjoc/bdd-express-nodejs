'use strict';
const express = require('express');
const controller = require('./controller');
const jwtMdw = require('../../app/middlewares/jwt-validator');
const mdwSVUser = require('../../app/middlewares/schema-validator')('users');

class UserRoutes {

    constructor() {
        this.router = express.Router();
        this.router.use(jwtMdw);
        this.routes();
    }

    routes() {
        this.router.get('/', controller.list);
        this.router.post('/', mdwSVUser, controller.create);
        this.router.get('/:id', controller.read);
        this.router.put('/:id', mdwSVUser, controller.update);
        this.router.delete('/:id', controller.delete);
    }

}

module.exports = new UserRoutes().router;
