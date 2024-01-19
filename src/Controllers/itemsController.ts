import { Request, Response } from 'express'
import { Item } from '../types'
import {  getUser, addItemInDB, editItemInDB, deleteItemInDB } from './mongoDBcontroller'

/**
 * Gets items from mongoDB document (object) and returns a response with a list of items (todo actions).
 * @param req 
 * @param res 
 */
export async function getItems(req: Request, res: Response) {
    
    let user: string | undefined = req.session.userLogin;

    if (user) {
        try {

            // Obtain of the user from DB.
            let userInDB: any = await getUser(user);
            
            res.json({ items: userInDB.items });

        } catch (err) {
            res.status(500).send({ "error": `${(err as Error).message}` })
        }

    } else {
        res.status(403).send({ error: 'forbidden' });
    }
}

/**
 * Adds a new item in database and retrieves a response with its ID number.
 * @param req 
 * @param res 
 */
export async function addItem (req: Request, res: Response) {
    try {
        let user: string | undefined = req.session.userLogin;
        

        if (user) {

            let todoCount = await addItemInDB(user, req.body.text);            

            // Retrieves a response to frontend client.
            res.json({ id: todoCount });
        } else {
            res.status(401).send('Not found');
        }

    } catch (err) {

        res.status(500).send({ "error ": `${(err as Error).message}` });
    }
}

/**
 * Edits selected item and returns "ok" from back to front.
 * @param req 
 * @param res 
 */
export async function editItem (req: Request, res: Response) {

    let itemID: number = req.body.id
    let newItem: Item = req.body;
    let username: string | undefined = req.session.userLogin

    try {

        await editItemInDB(username, itemID, newItem.text, newItem.checked);

        res.json({ ok: true });
    } catch (err) {

        res.status(500).send({ "error": `${(err as Error).message}` });
    }
}

/**
 * Deletes item from mongpDB and returns "ok" from back to front.
 * @param req 
 * @param res 
 */
export async function deleteItem (req: Request, res: Response) {
    let itemID: number = req.body.id

    let username: string | undefined = req.session.userLogin

    try {

        await deleteItemInDB(username, itemID)

        res.json({ ok: true });

    } catch (err) {

        res.status(500).send({ "error": `${(err as Error).message}` });
    }
}


