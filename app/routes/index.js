'use strict';
const express = require('express');
const dirTree = require('directory-tree');
const mdwResponseHelper = require('../middlewares/response-helper');

class Routes {

    constructor() {
        this.configRouter();
        this.configApiRouter();
    }

    configRouter() {
        this.router = express.Router();
        this.router.use(mdwResponseHelper());
        this.router.get('/', (req, res) => res.send('API Server Running ...'));
    }

    configApiRouter() {
        let apiRouteController = {};
        const apiFolderTree = dirTree('./api');
        apiFolderTree.children.forEach((apiSubFolderTree) => {
            const folderRouteController = apiSubFolderTree.name;
            apiRouteController[`/${folderRouteController}`] = require(`../../api/${folderRouteController}/router`);
        });
        this.configCustomRouter('api', apiRouteController);
    }

    configCustomRouter(prefixRoute, routeController) {
        const customRouter = express.Router();
        for (let route in routeController) customRouter.use(route, routeController[route]);
        this.router.use(`/${prefixRoute}`, customRouter);
    }
}

module.exports = new Routes().router;
