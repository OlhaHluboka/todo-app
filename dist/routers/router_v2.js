"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../Controllers/userController");
const itemsController_1 = require("../Controllers/itemsController");
const router = express_1.default.Router();
const path = '/router';
router.all(path, async (req, res) => {
    let query = req.query.action;
    switch (query) {
        case 'login': {
            await (0, userController_1.login)(req, res);
            break;
        }
        case 'logout': {
            await (0, userController_1.logout)(req, res);
            break;
        }
        case 'register': {
            await (0, userController_1.register)(req, res);
            break;
        }
        case 'getItems': {
            await (0, itemsController_1.getItems)(req, res);
            break;
        }
        case 'deleteItem': {
            await (0, itemsController_1.deleteItem)(req, res);
            break;
        }
        case 'createItem': {
            await (0, itemsController_1.addItem)(req, res);
            break;
        }
        case 'editItem': {
            await (0, itemsController_1.editItem)(req, res);
            break;
        }
        default: res.status(400).send({ error: `Unknown request command: ${query}` });
    }
});
exports.default = router;
