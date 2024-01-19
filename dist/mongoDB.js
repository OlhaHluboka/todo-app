"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.todoCounter = exports.todoItems = exports.client = void 0;
const mongodb_1 = require("mongodb");
require("dotenv/config");
const urlMongo = process.env.DB_MONGO;
exports.client = new mongodb_1.MongoClient(urlMongo);
exports.todoItems = exports.client.db("todo").collection("items");
exports.todoCounter = exports.client.db("todo").collection("counter");
let todoCount;
async function run() {
    try {
        // Connecting to the Mongo server
        await exports.client.connect();
        console.log('DB connection established!');
        // If there is no value in the count database we insert zero.
        let countBuffer = await exports.todoCounter.find().next();
        if (countBuffer === null) {
            todoCount = 0;
            exports.todoCounter.insertOne({ counter: 0 });
            // The connection between variable and database value.
        }
        else {
            todoCount = countBuffer.counter;
        }
    }
    catch (err) {
        console.log("An error occurred!");
        console.log(err);
    }
}
exports.run = run;
