'use strict';
const uuid = require('uuid');
const db = require('../../app/database');
const h = require('../../helpers');

class AuthController {

    async login(req, res) {
        try {
            const auth = req.body;
            const rows = await db.query('SELECT * FROM users WHERE email = ?', [auth.email.toLowerCase().trim()]);
            if (rows.length===0) return res.replayErr('User not found', 404);
            const user = rows[0];
            if (user.password !== h.crypto.Password(auth.password, user.password_salt))
                return res.replayErr('User password wrong', 401);
            h.object.removeKeys(user, "password", "password_salt");
            const tokenData = { name: user.name, email: user.email };
            user.token = h.jwt.sign(tokenData);
            res.replayData("User found", user);
        } catch (e) {
            res.replayErr(e.toString(), 500);
        }
    }

    async changePassword(req, res) {
        try {
            const newPassword = req.body.newPassword;
            const jwtToken = req.headers.authorization.split(' ')[1];
            const jwtEmail = h.jwt.decode(jwtToken).email;
            const newPasswordSalt = uuid.v4();
            let userChanges = {
                password_salt: newPasswordSalt,
                password: h.crypto.Password(newPassword, newPasswordSalt)
            };
            const reply = await db.query('UPDATE users SET ? WHERE email = ?', [userChanges, jwtEmail]);
            if (reply.affectedRows) res.replyMsg("User password updated successfully");
            else res.replayErr("Internal Error", 500);
        } catch (e) {
            res.replayErr(e.toString(), 422);
        }
    }

}

module.exports = new AuthController();
