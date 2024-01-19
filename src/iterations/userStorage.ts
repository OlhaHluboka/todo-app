import express, { Request, Response, Express } from 'express';
import path from 'path';
import bodyParser, { text } from 'body-parser';
import cors from 'cors';
import { MongoClient, Collection, WithId } from "mongodb";
import session, { Store } from 'express-session';
import fileStore, { FileStore } from 'session-file-store';


// Extends module 'express-session': adds a field "userLogin" in the user session JSON object
// that already contains a field "cookies" and others fields. You can see them in the directory
// "session" in your project.
declare module 'express-session' {
    interface SessionData {
        userLogin: string
    }
}

const app: Express = express();
const port: number = 3005;
const urlMongo: string = "mongodb://127.0.0.1:27017/";
const client: MongoClient = new MongoClient(urlMongo);
const todoItems: Collection = client.db("todo").collection("items");
const todoCounter: Collection = client.db("todo").collection("counter");
const FileStore: FileStore = fileStore(session);
let todoCount: number;

// Insert new types for facilitation of the work.
// Item is an element of todos array.
type Item = {
    id: number,
    text: string,
    checked: boolean
}

// User is one element in database.
type User = {
    name: string,
    pass: string,
    items: Item[]
}

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../static')));
app.use(cors({

    origin: 'http://localhost:3005',
    credentials: true

}));
app.use(session({
    store: new FileStore({ retries: 0 }),
    secret: 'verysecretword',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    }
}));

/**
 * The app code is a code for the server work. 
 */ 
async function run() {
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
        // Creates and listens server in the port specified from index.html
        app.listen(port, () => {
            console.log(`Fourth iteration - deploy users! This server started and is listening the port ${port}`);
        });

    } catch (err) {
        console.log("An error occurred!");
        console.log(err);
    }
}
// Run the server.
run();

/*      Routes for different users.    */

app.get('/api/v1/items', async (req: Request, res: Response) => { //+

    let user: string | undefined = req.session.userLogin;

    if (user) {
        try {

            let userContain: any = await todoItems.findOne({ name: user });

            res.json({ items: userContain.items });

        } catch (err) {
            res.status(500).send({ "error": `${(err as Error).message}` })
        }

    } else {
        res.status(403).send({ error: 'forbidden' });
    }
});

app.post('/api/v1/items', async (req: Request, res: Response) => {

    try {
        let user: string | undefined = req.session.userLogin;

        if (user) {
            // Pop an object from MongoDB in the buffer variable. (Object is a mongo document). 
            let collectionCounter: any = await todoCounter.findOne();
            todoCount = collectionCounter.counter;
            
            // Raise up to one
            todoCount++;

            // Changes a value of id in mongodb "todo" collection "counter".
            await todoCounter.updateOne({ counter: todoCount - 1 }, { $set: { counter: todoCount } });

            // Forms a new todo item based on request and updated count.
            let newTodo: Item = { id: todoCount, text: req.body.text, checked: false };

            // Updates an information about this user in database.
            await todoItems.updateOne({ name: user }, { $push: { items: newTodo } });

            // Retrieves a response to frontend client.
            res.json({ id: todoCount });
        } else {
            res.status(401).send('Not found');
        }

    } catch (err) {

        res.status(500).send({ "error ": `${(err as Error).message}` });
    }

});

app.post('/api/v1/register', async (req: Request, res: Response) => {

    try {
        let userLog: string = req.body.login;
        let password: string = req.body.pass;

        // Check presence of registered user in the database.
        let userContain: any = await todoItems.findOne({ name: userLog });

        if (!userContain) {
            
            // Does a new user in database.
            let newUser: User = { name: userLog, pass: password, items: [] };
            await todoItems.insertOne(newUser);  //+
            req.session.userLogin = userLog;
            res.json({ ok: true });
        
        // If user is presence - no add to database.
        } else {

            res.status(500).send({ error: 'Failed to add user' });
        }

    } catch (err) {
        res.status(500).send({ "error: ": `${(err as Error).message}` });
    }

})

app.post('/api/v1/login', async (req: Request, res: Response) => {
    
    try {
        let userLog: string = req.body.login;
        let password: string = req.body.pass;

        // Check if this user exists in database.
        let userContain: any = await todoItems.findOne({ name: userLog, pass: password });

        if (userContain) {
            req.session.userLogin = userLog;
            res.json({ ok: true });
        } else {

            res.status(401).send('Not found');
        }

    } catch (err) {
        res.status(500).send({ "error: ": `${(err as Error).message}` });
    }
})

app.post('/api/v1/logout', async (req: Request, res: Response) => {

    // We kills a session if user logout of the account.
    req.session.destroy((err) => {
        if (err) res.status(500).send({ "error": `${(err as Error).message}` });
        else res.json({ ok: true });
    });
})

app.put('/api/v1/items', async (req: Request, res: Response) => {

    let itemID: number = req.body.id

    let newItem: Item = req.body;
    let username: string | undefined = req.session.userLogin

    try {

        // Changes info inside the array of todo items of this current user.
        await todoItems.updateOne(
            { name: username },
            { $set: { "items.$[elem]": newItem } },
            { arrayFilters: [{ "elem.id": itemID }] }
        );

        res.json({ ok: true });
    } catch (err) {

        res.status(500).send({ "error": `${(err as Error).message}` });
    }

})

app.delete('/api/v1/items', async (req: Request, res: Response) => {

    let itemID: number = req.body.id

    let username: string | undefined = req.session.userLogin

    try {

        // Deletes one todo item in database if user has pressed to the cross) 
        await todoItems.updateOne(
            { name: username },
            { $pull: { items: { id: itemID } } }
        );

        res.json({ ok: true });

    } catch (err) {

        res.status(500).send({ "error": `${(err as Error).message}` });
    }
});

// npm run dev

