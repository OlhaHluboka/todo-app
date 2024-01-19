"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mongoDB_1 = require("./mongoDB");
const userController_1 = require("./Controllers/userController");
const itemsController_1 = require("./Controllers/itemsController");
app_1.app.post('/api/v2/router', (req, res) => {
    let query = req.query.action;
    switch (query) {
        case 'login': {
            (0, userController_1.login)(req, res);
            break;
        }
        case 'logout': {
            (0, userController_1.logout)(req, res);
            break;
        }
        case 'register': {
            (0, userController_1.register)(req, res);
            break;
        }
        case 'getItems': {
            (0, itemsController_1.getItems)(req, res);
            break;
        }
        case 'deleteItem': {
            (0, itemsController_1.deleteItem)(req, res);
            break;
        }
        case 'createItem': {
            (0, itemsController_1.addItem)(req, res);
            break;
        }
        case 'editItem': {
            (0, itemsController_1.editItem)(req, res);
            break;
        }
        default: res.status(400).send({ error: `Unknown request command: ${query}` });
    }
});
(0, mongoDB_1.run)();
// npm run dev  - without nodemon
// npm run go - with nodemon
