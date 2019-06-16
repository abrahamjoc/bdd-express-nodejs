'use strict';
require('./config-env');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const ip = require("ip");

const routes = require('../routes');
let serverInstance = null;

class Server {

    constructor(logger=true) {
        if (serverInstance) serverInstance.stop();
        serverInstance = this;

        this.app = express();
        this.logger = logger;
        this.config();
        this.routes();
    }

    config() {
        this.app.set('port', process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
        if (this.logger) this.app.use(morgan("dev"));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    routes() {
        this.app.use(routes);
    }

    start() {
        const port = this.app.get('port');
        this.url = `http://${ip.address()}:${port}`;
        this.server = this.app.listen(port, () => {
            if (this.logger) console.log('Running on: ', this.url);
        });
        return this.app;
    }

    async stop() {
        await this.server.close();
    }
}

module.exports = Server;
