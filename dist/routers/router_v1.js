"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemsController_1 = require("../Controllers/itemsController");
const userController_1 = require("../Controllers/userController");
const router = express_1.default.Router();
const path = '/items';
router.get(path, itemsController_1.getItems)
    .post(path, itemsController_1.addItem)
    .put(path, itemsController_1.editItem)
    .delete(path, itemsController_1.deleteItem)
    .post('login', userController_1.login)
    .post('logout', userController_1.logout)
    .post('register', userController_1.register);
exports.default = router;
