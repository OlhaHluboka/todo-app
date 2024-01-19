import express, {Request, Response} from "express";
import { login, logout, register } from '../Controllers/userController'
import { getItems, editItem, deleteItem, addItem } from '../Controllers/itemsController'

const router = express.Router();
const path: string = '/router';

router.all(path, async (req:Request, res:Response) => {
    let query: string = req.query.action as string
    switch (query) {
        case 'login': {
            await login(req, res)
            break;
        }
        case 'logout': {
            await logout(req, res)
            break;
        }
        case 'register': {
           await register(req, res)
            break;
        }
        case 'getItems': {
           await getItems(req, res)
            break;
        }
        case 'deleteItem': {
           await deleteItem(req, res)
            break;
        }
        case 'createItem': {
          await addItem(req, res)
            break;
        }
        case 'editItem': {
           await editItem(req, res)
            break;
        }
        default: res.status(400).send({ error: `Unknown request command: ${query}` })
    }
    
})

export default router;