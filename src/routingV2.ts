import { Request, Response } from 'express'
import {  app } from './app'
import {  run } from './mongoDB'
import { login, logout, register } from './Controllers/userController'
import { getItems, editItem, deleteItem, addItem } from './Controllers/itemsController'


app.post('/api/v2/router', (req: Request, res: Response) => {
    let query: string = req.query.action as string
    switch (query) {
        case 'login': {
            login(req, res)
            break;
        }
        case 'logout': {
            logout(req, res)
            break;
        }
        case 'register': {
            register(req, res)
            break;
        }
        case 'getItems': {
            getItems(req, res)
            break;
        }
        case 'deleteItem': {
            deleteItem(req, res)
            break;
        }
        case 'createItem': {
            addItem(req, res)
            break;
        }
        case 'editItem': {
            editItem(req, res)
            break;
        }
        default: res.status(400).send({ error: `Unknown request command: ${query}` })
    }
})
run();
// npm run dev  - without nodemon
// npm run go - with nodemon