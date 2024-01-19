import express from "express";
import { getItems, addItem, editItem, deleteItem } from "../Controllers/itemsController";
import { login, logout, register } from "../Controllers/userController";

const router = express.Router();
const path: string = '/items';

router.get(path, getItems)
    .post(path, addItem)
    .put(path, editItem)
    .delete(path, deleteItem)
    .post('login', login)
    .post('logout', logout)
    .post('register', register);

export default router;