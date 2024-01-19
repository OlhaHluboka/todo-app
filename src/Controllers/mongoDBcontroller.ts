import { MongoClient, Collection } from "mongodb";
import { User, Item } from '../types';
import 'dotenv/config';


const urlMongo: string = process.env.DB_MONGO as string;
export const client: MongoClient = new MongoClient(urlMongo);
export const todoItems: Collection = client.db("todo").collection("items");
export const todoCounter: Collection = client.db("todo").collection("counter");
let todoCount: number;

/**
 * Obtain the user from mongoDB with parameter "login" which transfered from the front client.
 * If this user exists in the database, returns an object with name, pass and items fields.
 * If no - return undefined.
 * 
 * @param login - name of user, which transfeted from web page in browser.
 * @returns - an object.
 */
export async function getUser(login: string) {

    try {

        let userContain: any = await todoItems.findOne({ name: login });

        if (userContain) {
            return {
                name: userContain.name,
                pass: userContain.pass,
                items: userContain.items
            }

        } else {
            console.log(`It is impossible to get object from mongoDB. `);

            return undefined;
        }
    } catch (err) {

        console.log(`Error -  ${err}`);
    }

}

/**
 * Add a new user to mongoDB which transfered from the front client.
 *  
 * @param user - name of user, which transfeted from web page in browser. * 
 */
export async function addUser(user: User) {

    try {

        await todoItems.insertOne(user);

    } catch (err) {

        console.log(`Error -  ${err}`);
    }

}

/**
 * Adds a new item by user login to the database.
 *
 * @param login the user login as string
 * @param text the text of the new item that needs to be added
 * @returns - the id of a new item.
 */
export async function addItemInDB(login: string, text: string) {
    try {

        let collectionCounter: any = await todoCounter.findOne();
        todoCount = collectionCounter.counter;

        // Raise up to one
        todoCount++;

        // Changes a value of id in mongodb "todo" collection "counter".
        await todoCounter.updateOne({ counter: todoCount - 1 }, { $set: { counter: todoCount } });

        // Forms a new todo item based on request and updated count.
        let item: Item = { id: todoCount, text: text, checked: false };

        await todoItems.updateOne({ "name": login }, { $push: { "items": item } });

        return todoCount;
        
    } catch (err) {

        console.log(`Error -  ${err}`);
    }
}

/**
 * Updates the data of the selected item.
 *
 * @param login the user login as string.
 * @param id the identifier of the item to be updated.
 * @param text the new text for the item.
 * @param checked the new status for the item.
 */
export async function editItemInDB(login:string |undefined, id: number, text: string, checked: boolean) {
    try {
        
        await todoItems.findOneAndUpdate(
            { "name": login, "items.id": id},
            { $set: {
                "items.$.text": text,
                "items.$.checked": checked
            }}
        )
    } catch (err) {

        console.log(`Error -  ${err}`);
    }
}

/**
 * Deletes the selected item.
 *
 * @param login the user login as string
 * @param id the identifier of the item to be deleted
 */
export async function deleteItemInDB(login: string|undefined, id: number) {
    try {
        
        await todoItems.updateOne(
            {"name": login},
            { $pull: {"items": {"id": id} } }
        )
    } catch (err) {

        console.log(`Error -  ${err}`);
    }
}

