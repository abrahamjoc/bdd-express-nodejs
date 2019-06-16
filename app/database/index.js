'use strict';
const mysql = require('promise-mysql');
const baseSQL = require('./base.sql');

class MySQLHandler {

    constructor() {
        const dbkeys = {
            host: process.env.DBHOST || '',
            user: process.env.DBUSER || '',
            password: process.env.DBPASS || '',
            database: process.env.DBNAME || '',
        };
        this.pool = mysql.createPool(dbkeys);
        this.initConnection();
        this.initBaseSQL();
        this.setWrapMethods();
    }

    initConnection() {
        const handlerConnection = (conn) => {
            this.pool.releaseConnection(conn);
        };
        this.pool.getConnection().then(handlerConnection);
    }

    async initBaseSQL() {
        baseSQL.forEach(async (query) => {
            try { await this.pool.query(query) } catch (err) {}
        });
    }

    setWrapMethods() {

        this.query = this.pool.query;

        this.selectByLimitSkipSort = (table, opts) => {
            if (!table) throw 'table argument is required';
            opts = opts || {};
            if (opts.order && opts.order !== 'ASC' && opts.order !== 'DESC') throw 'opts.order must be ASC or DESC';
            opts = {
                limit: opts.limit || 1000,
                skip: opts.skip || 0,
                sort: opts.sort || 'id',
                order: opts.order || 'ASC',
            };
            return this.query(
                `SELECT * FROM ${table} ORDER BY ${opts.sort} ${opts.order} LIMIT ${opts.limit} OFFSET ${opts.skip}`
            )
        };

        this.selectRowById = async (table, id) => {
            if (!table) throw 'table argument is required';
            if (!id) throw 'id argument is required';
            const rows = await this.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
            return rows[0];
        };

        this.insertRow = (table, props) => {
            if (!table) throw 'table argument is required';
            props = props || {};
            return this.query(`INSERT INTO ${table} set ?`, props)
        };

        this.updateById = async (table, id, props) => {
            if (!table) throw 'table argument is required';
            if (!id) throw 'id argument is required';
            props = props || {};
            return this.query(`UPDATE ${table} SET ? WHERE id = ?`, [props, id]);
        };

        this.deleteById = async (table, id) => {
            if (!table) throw 'table argument is required';
            if (!id) throw 'id argument is required';
            return this.query(`DELETE FROM ${table} WHERE id = ?`, id);
        };

    }
}

module.exports = new MySQLHandler();
