"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const mongoDBcontroller_1 = require("./mongoDBcontroller");
/**
 * The regulator of a new user registering in the database.
 * @param req
 * @param res
 */
async function register(req, res) {
    try {
        let userLog = await req.body.login;
        let password = await req.body.pass;
        // Check presence of registered user in the database.
        let userContain = await mongoDBcontroller_1.todoItems.findOne({ name: userLog });
        if (!userContain) {
            // Does a new user in database.
            let newUser = { name: userLog, pass: password, items: [] };
            await mongoDBcontroller_1.todoItems.insertOne(newUser);
            req.session.userLogin = userLog;
            res.json({ ok: true });
            // If user is presence - no add to database.
        }
        else {
            res.status(500).send({ error: 'Failed to add user' });
        }
    }
    catch (err) {
        res.status(500).send({ "error: ": `${err.message}` });
    }
}
exports.register = register;
/**
 * The regulator of a new user login.
 * @param req
 * @param res
 */
async function login(req, res) {
    try {
        let userLog = await req.body.login;
        let password = await req.body.pass;
        // Check if this user exists in database.
        let userContain = await mongoDBcontroller_1.todoItems.findOne({ name: userLog, pass: password });
        if (userContain) {
            // Activate a new session with this user.
            req.session.userLogin = userLog;
            res.json({ ok: true });
        }
        else {
            res.status(401).send('Not found');
        }
    }
    catch (err) {
        res.status(500).send({ "error: ": `${err.message}` });
    }
}
exports.login = login;
/**
 * The regulator of a new user logout.
 * @param req
 * @param res
 */
async function logout(req, res) {
    // We kills a session if user logout of the account.
    req.session.destroy((err) => {
        if (err)
            res.status(500).send({ "error": `${err.message}` });
        else
            res.json({ ok: true });
    });
}
exports.logout = logout;
