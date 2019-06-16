'use strict';
const uuid = require('uuid');
const db = require('../../app/database');
const h = require('../../helpers');

class UserController {

    async list(req, res) {
        try {
            const opts = {
                limit: req.query.limit,
                skip: req.query.skip,
                sort: req.query.sort,
                order: req.query.desc ? 'ASC' : 'DESC',
            };
            const rows = await db.selectByLimitSkipSort('users', opts);
            res.replayData("Listing users", rows);
        } catch (e) {
            res.replayErr(e.toString(), 500);
        }
    }

    async create(req, res) {
        try {
            if (!req.body.password) res.replayErr("password is required", 400);
            const passwordSalt = uuid.v4();
            const newUser = {
                ...req.body,
                email: req.body.email.toLowerCase().trim(),
                password_salt: passwordSalt,
                password: h.crypto.Password(req.body.password, passwordSalt),
            };
            const reply = await db.insertRow('users', newUser);
            res.replayData("User created", {insertId: reply.insertId}, 201);
        } catch (e) {
            res.replayErr(e.toString(), 422);
        }
    }

    async read(req, res) {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await db.selectRowById('users', userId);
            h.object.removeKeys(user, "password", "password_salt");
            res.replayData("User found", user);
        } catch (err) {
            switch (err.message) {
                case 'Cannot convert undefined or null to object':
                    return res.replayErr('User not found', 404);
                default:
                    res.replayErr(err.toString(), 500);
            }

        }
    }

    async update(req, res) {
        try {
            const userId = parseInt(req.params.id, 10);
            const userChanges = req.body;
            h.object.removeKeys(userChanges, "email", "password", "password_salt", "created_at");
            const reply = await db.updateById('users', userId, userChanges);
            if (reply.affectedRows) res.replyMsg("User updated");
            else res.replayErr("User not found", 404);
        } catch (e) {
            res.replayErr(e.toString(), 422);
        }
    }

    async delete(req, res) {
        try {
            const userId = parseInt(req.params.id, 10);
            const reply = await db.deleteById('users', userId);
            if (reply.affectedRows) res.replyMsg("User deleted");
            else res.replayErr("User not found", 404);
        } catch (e) {
            res.replayErr(e.toString(), 500);
        }
    }
}

module.exports = new UserController();
