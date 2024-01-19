"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3005;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../static')));
app.use((0, cors_1.default)({
    origin: 'http://localhost:3005',
    credentials: true
}));
// Entity (or module) for the first iteration api when we save data in the memory of computer (in array of Objects)
const todoList = { items: [] };
// We need to define a new Id to new task every time.
let todoId = 0;
// Creates and listens server in the port specified from index.html
app.listen(port, () => {
    console.log(`First iteration - using local storage! This server started and is listening the port ${port}`);
});
// The first route for entity "Todo list". Retrieves to front all todo list and it shows it in browsers.  
app.get('/api/v1/items', (req, res) => {
    res.send(JSON.stringify(todoList));
});
// The second route of todo app. Add the new task in the array (for iteration 1 - in memory of computer.)
// Retrieves to front the new ID of Task.
app.post('/api/v1/items', (req, res) => {
    todoList.items.push({ id: ++todoId, text: req.body.text, checked: false });
    res.send(JSON.stringify({ id: todoId }));
});
// The third route of todo app. Changes a text in the task received from front. Retrieves to front an 
// object {ok: true} 
app.put('/api/v1/items', (req, res) => {
    // Fields for new information from the front.
    let newText = req.body.text;
    let newCheck = req.body.checked;
    // Find the task in our memory structure - array.
    let indexOfTask = todoList.items.findIndex((item) => item.id === req.body.id);
    // Changes properties in our object.
    // If index == -1 - this element is not exist in array.
    if (indexOfTask !== -1) {
        todoList.items[indexOfTask].text = newText;
        todoList.items[indexOfTask].checked = newCheck;
        res.status(200).send(JSON.stringify({ ok: true }));
    }
    else {
        res.status(404).json({ "error": "item not exist" });
    }
});
// The fourth route of todo app. Delete the task received from front. Retrieves to front an 
// object {ok: true} 
app.delete('/api/v1/items', (req, res) => {
    // Find the task in our memory structure - array.
    let index = todoList.items.findIndex(item => item.id === req.body.id);
    if (index !== -1) {
        // Deletes from array this task.
        todoList.items.splice(index, 1);
        //res.send (JSON.stringify({ok: true}));
        res.status(200).send(JSON.stringify({ ok: true }));
    }
    else {
        res.status(404).json({ "error": "item not exist" });
    }
});
//  npm run dev
