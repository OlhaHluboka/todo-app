import { Request, Response } from 'express'
import { User } from '../types'
import { todoItems } from './mongoDBcontroller'

/**
 * The regulator of a new user registering in the database.
 * @param req 
 * @param res 
 */
export async function register (req:Request, res:Response) {

    try {
        let userLog: string = await req.body.login;
        let password: string = await req.body.pass;

        // Check presence of registered user in the database.
        let userContain: any = await todoItems.findOne({ name: userLog });

        if (!userContain) {
            
            // Does a new user in database.
            let newUser: User = { name: userLog, pass: password, items: [] };
            await todoItems.insertOne(newUser);  

            req.session.userLogin = userLog;

            res.json({ ok: true });
        
        // If user is presence - no add to database.
        } else {

            res.status(500).send({ error: 'Failed to add user' });
        }

    } catch (err) {
        res.status(500).send({ "error: ": `${(err as Error).message}` });
    }

}

/**
 * The regulator of a new user login.
 * @param req 
 * @param res 
 */
export async function login (req:Request, res:Response) {
    try {
        
        let userLog: string = await req.body.login;
        let password: string = await req.body.pass;

        // Check if this user exists in database.
        let userContain: any = await todoItems.findOne({ name: userLog, pass: password });

        if (userContain) {
            
            // Activate a new session with this user.
            req.session.userLogin = userLog;
            res.json({ ok: true });
        } else {

            res.status(401).send('Not found');
        }

    } catch (err) {
        res.status(500).send({ "error: ": `${(err as Error).message}` });
    }
}

/**
 * The regulator of a new user logout.
 * @param req 
 * @param res 
 */
export async function logout (req:Request, res:Response) {
    // We kills a session if user logout of the account.
   req.session.destroy((err) => {
        if (err) res.status(500).send({ "error": `${(err as Error).message}` });
        else res.json({ ok: true });
    });
}

    
