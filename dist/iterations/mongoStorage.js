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
const app = (0, express_1.default)();
const port = 3005;
const urlMongo = "mongodb://127.0.0.1:27017/";
const client = new mongodb_1.MongoClient(urlMongo);
const todoItems = client.db("todo").collection("items");
const todoCounter = client.db("todo").collection("counter");
let todoCount;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../front')));
app.use((0, cors_1.default)({
    origin: 'http://localhost:3005',
    credentials: true
}));
// Establishes a connection with the MongoDB server than this our server to listen port 3005
async function run() {
    try {
        // Connecting to the Mongo server
        await client.connect();
        console.log('DB connection established.');
        let countBuffer = await todoCounter.find().next();
        if (countBuffer === null) {
            todoCount = 0;
            todoCounter.insertOne({ counter: 0 });
        }
        else {
            todoCount = countBuffer.counter;
        }
        // Creates and listens server in the port specified from index.html
        app.listen(port, () => {
            console.log(`Third iteration - using MongoDB! This server started and is listening the port ${port}`);
        });
    }
    catch (err) {
        console.log("An error occurred!");
        console.log(err);
    }
}
run();
app.get('/api/v1/items', async (req, res) => {
    try {
        let arrayOfItems = await todoItems.find().toArray();
        res.json({ items: arrayOfItems });
    }
    catch (err) {
        res.status(500).send({ "error": `${err.message}` });
    }
});
app.post('/api/v1/items', async (req, res) => {
    try {
        // Pop an object from MongoDB in the buffer variable. (Object is a mongo document). 
        let collectionCounter = await todoCounter.findOne();
        todoCount = collectionCounter.counter;
        // Raise up to one
        todoCount++;
        // Changes a value of id in mongodb "todo" collection "counter".
        await todoCounter.updateOne({ counter: todoCount - 1 }, { $set: { counter: todoCount } });
        // Add a new object (document) in mongodb collection "items".
        await todoItems.insertOne({ id: todoCount, text: req.body.text, checked: false });
        // Retrieves a response to frontend client.
        res.json({ id: todoCount });
    }
    catch (err) {
        res.status(500).send({ "error": `${err.message}` });
    }
});
app.put('/api/v1/items', async (req, res) => {
    try {
        // Buffered variables for recieving a new text and a new checked
        let newText = req.body.text;
        let newCheck = req.body.checked;
        // Updates text and checked properties in mongodb collection "items".
        await todoItems.updateOne({ id: req.body.id }, { $set: { text: newText, checked: newCheck } });
        res.json({ ok: true });
    }
    catch (err) {
        res.status(500).send({ "error": `${err.message}` });
    }
});
app.delete('/api/v1/items', async (req, res) => {
    try {
        await todoItems.deleteOne({ id: req.body.id });
        res.json({ ok: true });
    }
    catch (err) {
        res.status(500).send({ "error": `${err.message}` });
    }
});
// npm run dev
