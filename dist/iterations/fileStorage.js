"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * There is a backend for todo-application with data retention in files "todoList.json" and
 * counter.txt
 */
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3005;
const counterPath = ("counter.txt");
const filePath = ("todoList.json");
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../static')));
app.use((0, cors_1.default)({
    origin: 'http://localhost:3005',
    credentials: true
}));
// Creates and listens server in the port specified from index.html
app.listen(port, () => {
    console.log(`Second iteration - using file storage! This server started and is listening the port ${port}`);
});
// Variables for retention data in files
let todoCount;
// Model of data
let todoItems = { items: [] };
app.get('/api/v1/items', (req, res) => {
    todoItems = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    try {
        todoCount = JSON.parse(fs_1.default.readFileSync(counterPath, 'utf-8'));
    }
    catch (error) {
        fs_1.default.writeFileSync(counterPath, '0');
    }
    res.send(JSON.stringify(todoItems));
});
app.post('/api/v1/items', (req, res) => {
    todoCount = +fs_1.default.readFileSync(counterPath, 'utf-8');
    todoCount++;
    fs_1.default.writeFileSync(counterPath, `${todoCount}`, 'utf-8');
    todoItems = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    todoItems.items.push({ id: todoCount, text: req.body.text, checked: req.body.checked });
    fs_1.default.writeFileSync(filePath, JSON.stringify(todoItems), 'utf-8');
    res.send(JSON.stringify({ id: todoCount }));
});
app.put('/api/v1/items', (req, res) => {
    // Fields for new information from the front.
    todoItems = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    let newText = req.body.text;
    let newCheck = req.body.checked;
    // Find the task in our memory structure - array.
    let indexOfTask = todoItems.items.findIndex((item) => item.id === req.body.id);
    // Changes properties in our object.
    // If index == -1 - this element is not exist in array.
    if (indexOfTask !== -1) {
        todoItems.items[indexOfTask].text = newText;
        todoItems.items[indexOfTask].checked = newCheck;
        fs_1.default.writeFileSync(filePath, JSON.stringify(todoItems), 'utf-8');
        res.status(200).send(JSON.stringify({ ok: true }));
    }
    else {
        res.status(404).json({ "error": "item not exist" });
    }
});
app.delete('/api/v1/items', (req, res) => {
    todoItems = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    // Find the task in our memory structure - array.
    let index = todoItems.items.findIndex(item => item.id === req.body.id);
    let newIndex = 1;
    if (index !== -1) {
        // Deletes from array this task.
        todoItems.items.splice(index, 1);
        todoCount = JSON.parse(fs_1.default.readFileSync(counterPath, 'utf-8'));
        todoCount--;
        fs_1.default.writeFileSync(counterPath, JSON.stringify(todoCount), 'utf-8');
        todoItems.items.forEach(item => {
            item.id = newIndex;
            newIndex++;
        });
        fs_1.default.writeFileSync(filePath, JSON.stringify(todoItems), 'utf-8');
        res.status(200).send(JSON.stringify({ ok: true }));
    }
    else {
        res.status(404).json({ "error": "item not exist" });
    }
});
//  npm run dev
