"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemInDB = exports.editItemInDB = exports.addItemInDB = exports.addUser = exports.getUser = exports.todoCounter = exports.todoItems = exports.client = void 0;
const mongodb_1 = require("mongodb");
require("dotenv/config");
const urlMongo = process.env.DB_MONGO;
exports.client = new mongodb_1.MongoClient(urlMongo);
exports.todoItems = exports.client.db("todo").collection("items");
exports.todoCounter = exports.client.db("todo").collection("counter");
let todoCount;
/**
 * Obtain the user from mongoDB with parameter "login" which transfered from the front client.
 * If this user exists in the database, returns an object with name, pass and items fields.
 * If no - return undefined.
 *
 * @param login - name of user, which transfeted from web page in browser.
 * @returns - an object.
 */
async function getUser(login) {
    try {
        let userContain = await exports.todoItems.findOne({ name: login });
        if (userContain) {
            return {
                name: userContain.name,
                pass: userContain.pass,
                items: userContain.items
            };
        }
        else {
            console.log(`It is impossible to get object from mongoDB. `);
            return undefined;
        }
    }
    catch (err) {
        console.log(`Error -  ${err}`);
    }
}
exports.getUser = getUser;
/**
 * Add a new user to mongoDB which transfered from the front client.
 *
 * @param user - name of user, which transfeted from web page in browser. *
 */
async function addUser(user) {
    try {
        await exports.todoItems.insertOne(user);
    }
    catch (err) {
        console.log(`Error -  ${err}`);
    }
}
exports.addUser = addUser;
/**
 * Adds a new item by user login to the database.
 *
 * @param login the user login as string
 * @param text the text of the new item that needs to be added
 * @returns - the id of a new item.
 */
async function addItemInDB(login, text) {
    try {
        let collectionCounter = await exports.todoCounter.findOne();
        todoCount = collectionCounter.counter;
        // Raise up to one
        todoCount++;
        // Changes a value of id in mongodb "todo" collection "counter".
        await exports.todoCounter.updateOne({ counter: todoCount - 1 }, { $set: { counter: todoCount } });
        // Forms a new todo item based on request and updated count.
        let item = { id: todoCount, text: text, checked: false };
        await exports.todoItems.updateOne({ "name": login }, { $push: { "items": item } });
        return todoCount;
    }
    catch (err) {
        console.log(`Error -  ${err}`);
    }
}
exports.addItemInDB = addItemInDB;
/**
 * Updates the data of the selected item.
 *
 * @param login the user login as string.
 * @param id the identifier of the item to be updated.
 * @param text the new text for the item.
 * @param checked the new status for the item.
 */
async function editItemInDB(login, id, text, checked) {
    try {
        await exports.todoItems.findOneAndUpdate({ "name": login, "items.id": id }, { $set: {
                "items.$.text": text,
                "items.$.checked": checked
            } });
    }
    catch (err) {
        console.log(`Error -  ${err}`);
    }
}
exports.editItemInDB = editItemInDB;
/**
 * Deletes the selected item.
 *
 * @param login the user login as string
 * @param id the identifier of the item to be deleted
 */
async function deleteItemInDB(login, id) {
    try {
        await exports.todoItems.updateOne({ "name": login }, { $pull: { "items": { "id": id } } });
    }
    catch (err) {
        console.log(`Error -  ${err}`);
    }
}
exports.deleteItemInDB = deleteItemInDB;
