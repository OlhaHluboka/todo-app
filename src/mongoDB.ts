import { MongoClient, Collection } from "mongodb";
import 'dotenv/config';

const urlMongo: string = process.env.DB_MONGO as string;
export const client: MongoClient = new MongoClient(urlMongo);
export const todoItems: Collection = client.db("todo").collection("items");
export const todoCounter: Collection = client.db("todo").collection("counter");
let todoCount: number;

export async function run() {
    try {
        // Connecting to the Mongo server
        await client.connect();

        console.log('DB connection established!');

        // If there is no value in the count database we insert zero.
        let countBuffer: any = await todoCounter.find().next();

        if (countBuffer === null) {

            todoCount = 0;
            todoCounter.insertOne({ counter: 0 });
        
        // The connection between variable and database value.
        } else {

            todoCount = countBuffer.counter;
        }
 
    } catch (err) {
        console.log("An error occurred!");
        console.log(err);
    }
}


