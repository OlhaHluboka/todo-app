/** Finalized API according to recomendations by ChatGPT about working with module Routing in Express.  */

import express, { Express } from 'express';
import { run } from './mongoDB';
import path from 'path';
import bodyParser, { text } from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import fileStore, { FileStore } from 'session-file-store';
import api_v1 from './routers/router_v1';
import api_v2 from './routers/router_v2';

declare module 'express-session' {
    export interface SessionData {
        userLogin: string
    }
}

export const app: Express = express();
export const port: number = 3005;
export const FileStoreSession: FileStore = fileStore(session);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../static')));
/* app.use(cors({

    origin: 'http://localhost:8080',
    credentials: true

})); */

app.use(session({
    store: new FileStoreSession({ retries: 0 }),
    secret: 'verysecretword',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    }
}));

//app.use ('/api/v1', api_v1);
app.use ('/api/v2', api_v2);


app.listen(port, () => {
    console.log(`The server started and is listening the port ${port}`);
});

run();

// npm start