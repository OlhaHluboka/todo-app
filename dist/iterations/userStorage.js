"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
const express_session_1 = __importDefault(require("express-session"));
const session_file_store_1 = __importDefault(require("session-file-store"));
const app = (0, express_1.default)();
const port = 3005;
const urlMongo = "mongodb://127.0.0.1:27017/";
const client = new mongodb_1.MongoClient(urlMongo);
const todoItems = client.db("todo").collection("items");
const todoCounter = client.db("todo").collection("counter");
const FileStore = (0, session_file_store_1.default)(express_session_1.default);
let todoCount;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../static')));
app.use((0, cors_1.default)({
    origin: 'http://localhost:3005',
    credentials: true
}));
app.use((0, express_session_1.default)({
    store: new FileStore({ retries: 0 }),
    secret: 'verysecretword',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    }
}));
/**
 * The app code is a code for the server work.
 */
async function run() {
    try {
        // Connecting to the Mongo server
        await client.connect();
        console.log('DB connection established!');
        // If there is no value in the count database we insert zero.
        let countBuffer = await todoCounter.find().next();
        if (countBuffer === null) {
            todoCount = 0;
            todoCounter.insertOne({ counter: 0 });
            // The connection between variable and database value.
        }
        else {
            todoCount = countBuffer.counter;
        }
        // Creates and listens server in the port specified from index.html
        app.listen(port, () => {
            console.log(`Fourth iteration - deploy users! This server started and is listening the port ${port}`);
        });
    }
    catch (err) {
        console.log("An error occurred!");
        console.log(err);
    }
}
// Run the server.
run();
/*      Routes for different users.    */
app.get('/api/v1/items', async (req, res) => {
    let user = req.session.userLogin;
    if (user) {
        try {
            let userContain = await todoItems.findOne({ name: user });
            res.json({ items: userContain.items });
        }
        catch (err) {
            res.status(500).send({ "error": `${err.message}` });
        }
    }
    else {
        res.status(403).send({ error: 'forbidden' });
    }
});
app.post('/api/v1/items', async (req, res) => {
    try {
        let user = req.session.userLogin;
        if (user) {
            // Pop an object from MongoDB in the buffer variable. (Object is a mongo document). 
            let collectionCounter = await todoCounter.findOne();
            todoCount = collectionCounter.counter;
            // Raise up to one
            todoCount++;
            // Changes a value of id in mongodb "todo" collection "counter".
            await todoCounter.updateOne({ counter: todoCount - 1 }, { $set: { counter: todoCount } });
            // Forms a new todo item based on request and updated count.
            let newTodo = { id: todoCount, text: req.body.text, checked: false };
            // Updates an information about this user in database.
            await todoItems.updateOne({ name: user }, { $push: { items: newTodo } });
            // Retrieves a response to frontend client.
            res.json({ id: todoCount });
        }
        else {
            res.status(401).send('Not found');
        }
    }
    catch (err) {
        res.status(500).send({ "error ": `${err.message}` });
    }
});
app.post('/api/v1/register', async (req, res) => {
    try {
        let userLog = req.body.login;
        let password = req.body.pass;
        // Check presence of registered user in the database.
        let userContain = await todoItems.findOne({ name: userLog });
        if (!userContain) {
            // Does a new user in database.
            let newUser = { name: userLog, pass: password, items: [] };
            await todoItems.insertOne(newUser); //+
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
});
app.post('/api/v1/login', async (req, res) => {
    try {
        let userLog = req.body.login;
        let password = req.body.pass;
        // Check if this user exists in database.
        let userContain = await todoItems.findOne({ name: userLog, pass: password });
        if (userContain) {
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
});
app.post('/api/v1/logout', async (req, res) => {
    // We kills a session if user logout of the account.
    req.session.destroy((err) => {
        if (err)
            res.status(500).send({ "error": `${err.message}` });
        else
            res.json({ ok: true });
    });
});
app.put('/api/v1/items', async (req, res) => {
    let itemID = req.body.id;
    let newItem = req.body;
    let username = req.session.userLogin;
    try {
        // Changes info inside the array of todo items of this current user.
        await todoItems.updateOne({ name: username }, { $set: { "items.$[elem]": newItem } }, { arrayFilters: [{ "elem.id": itemID }] });
        res.json({ ok: true });
    }
    catch (err) {
        res.status(500).send({ "error": `${err.message}` });
    }
});
app.delete('/api/v1/items', async (req, res) => {
    let itemID = req.body.id;
    let username = req.session.userLogin;
    try {
        // Deletes one todo item in database if user has pressed to the cross) 
        await todoItems.updateOne({ name: username }, { $pull: { items: { id: itemID } } });
        res.json({ ok: true });
    }
    catch (err) {
        res.status(500).send({ "error": `${err.message}` });
    }
});
// npm run dev
