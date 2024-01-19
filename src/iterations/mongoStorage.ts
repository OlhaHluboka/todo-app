import express, { Express } from 'express';
import { Request, Response } from 'express';
import path from 'path';
import bodyParser, { text } from 'body-parser';
import cors from 'cors';
import { MongoClient, Collection } from "mongodb";

const app: Express = express();
const port: number = 3005;
const urlMongo: string = "mongodb://127.0.0.1:27017/";
const client: MongoClient = new MongoClient(urlMongo);
const todoItems: Collection = client.db("todo").collection("items");
const todoCounter: Collection = client.db("todo").collection("counter");
let todoCount: number;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../front')));

app.use(cors({

    origin: 'http://localhost:3005',
    credentials: true

}));

// Establishes a connection with the MongoDB server than this our server to listen port 3005

async function run() {
    try {
        // Connecting to the Mongo server
        await client.connect();

        console.log('DB connection established.');

        let countBuffer: any = await todoCounter.find().next();

        if (countBuffer === null) {

            todoCount = 0;
            todoCounter.insertOne({ counter: 0 });
        } else {

            todoCount = countBuffer.counter;
        }
        // Creates and listens server in the port specified from index.html
        app.listen(port, () => {
            console.log(`Third iteration - using MongoDB! This server started and is listening the port ${port}`);
        });

    } catch (err) {
        console.log("An error occurred!");
        console.log(err);
    }
}

run();

app.get('/api/v1/items', async (req: Request, res: Response) => {

    try {
        let arrayOfItems:Object[] = await todoItems.find().toArray();
        res.json({ items: arrayOfItems });

    } catch (err) {
        res.status(500).send({ "error": `${(err as Error).message}` })
    }
});

app.post('/api/v1/items', async (req: Request, res: Response) => {

    try {
        // Pop an object from MongoDB in the buffer variable. (Object is a mongo document). 
        let collectionCounter: any = await todoCounter.findOne();
        todoCount = collectionCounter.counter;

        // Raise up to one
        todoCount++;

        // Changes a value of id in mongodb "todo" collection "counter".
        await todoCounter.updateOne({ counter: todoCount - 1 }, { $set: { counter: todoCount } });

        // Add a new object (document) in mongodb collection "items".
        await todoItems.insertOne({ id: todoCount, text: req.body.text, checked: false });

        // Retrieves a response to frontend client.
        res.json({ id: todoCount });

    } catch (err) {

        res.status(500).send({ "error": `${(err as Error).message}` });
    }

});

app.put('/api/v1/items', async (req: Request, res: Response) => {

    try {
       
        // Buffered variables for recieving a new text and a new checked
        let newText: string = req.body.text;
        let newCheck: boolean = req.body.checked;

        // Updates text and checked properties in mongodb collection "items".
        await todoItems.updateOne({id: req.body.id}, {$set: {text: newText, checked: newCheck}});

        res.json({ ok: true });      
    } catch (err) {

        res.status(500).send({ "error": `${(err as Error).message}` });
    }

})

app.delete('/api/v1/items', async (req:Request, res:Response) => {

    try {
        await todoItems.deleteOne ({id: req.body.id});

        res.json({ ok: true }); 

    } catch (err) {

        res.status(500).send({ "error": `${(err as Error).message}` });

    }
});

// npm run dev



