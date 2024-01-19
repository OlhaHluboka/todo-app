/**
 * There is a backend for todo-application with data retention in files "todoList.json" and
 * counter.txt 
 */
import express, { Express } from 'express';
import { Request, Response } from 'express';
import path from 'path';
import bodyParser, { text } from 'body-parser';
import cors from 'cors';
import fs from 'fs'


const app: Express = express();
const port: number = 3005;
const counterPath: string = ("counter.txt"); 
const filePath: string = ( "todoList.json");

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../static')));
app.use(cors({

  origin: 'http://localhost:3005',
  credentials: true

}));


// Creates and listens server in the port specified from index.html
app.listen(port, () => {
  console.log(`Second iteration - using file storage! This server started and is listening the port ${port}`);
});

// Variables for retention data in files
let todoCount: number;

// Model of data
let todoItems:{ items : {id:number, text:string, checked:boolean}[] } = { items: []};

app.get('/api/v1/items', (req: Request, res: Response) => {

    todoItems = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
   try {
    todoCount = JSON.parse(fs.readFileSync(counterPath, 'utf-8'));

   } catch (error) {

    fs.writeFileSync(counterPath, '0');

   }

    res.send(JSON.stringify(todoItems));
  
  });

  app.post('/api/v1/items', (req:Request, res:Response) => {


    todoCount = +fs.readFileSync(counterPath, 'utf-8');
    todoCount++;
    fs.writeFileSync(counterPath, `${todoCount}`, 'utf-8');

    todoItems = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    todoItems.items.push({ id: todoCount, text: req.body.text, checked: req.body.checked });
    fs.writeFileSync(filePath, JSON.stringify(todoItems), 'utf-8' );
    
  
    res.send(JSON.stringify({ id: todoCount }));
  });

  app.put('/api/v1/items', (req:Request, res:Response) => {

    // Fields for new information from the front.
    todoItems = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let newText: string = req.body.text;
    let newCheck: boolean = req.body.checked;
  
    // Find the task in our memory structure - array.
    let indexOfTask: number = todoItems.items.findIndex((item) => item.id === req.body.id);
  
    // Changes properties in our object.
    // If index == -1 - this element is not exist in array.
    if (indexOfTask !== -1) {
      todoItems.items[indexOfTask].text = newText;
      todoItems.items[indexOfTask].checked = newCheck;
      fs.writeFileSync(filePath, JSON.stringify(todoItems), 'utf-8' ); 
  
      res.status(200).send(JSON.stringify({ ok: true }));
    } else {
  
      res.status(404).json({"error": "item not exist"})
    }
  
  })

  app.delete('/api/v1/items', (req:Request, res:Response) => {

    todoItems = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Find the task in our memory structure - array.
    let index: number = todoItems.items.findIndex(item => item.id === req.body.id);

    let newIndex:number = 1;
  
    if (index !== -1) {
    // Deletes from array this task.
    todoItems.items.splice(index, 1);

    todoCount = JSON.parse(fs.readFileSync(counterPath, 'utf-8'));
    todoCount--;
    fs.writeFileSync(counterPath, JSON.stringify(todoCount), 'utf-8' );

    
    todoItems.items.forEach(item => {
        item.id =  newIndex;
        newIndex++;
    })

    fs.writeFileSync(filePath, JSON.stringify(todoItems), 'utf-8' );
  
    res.status(200).send(JSON.stringify({ ok: true }));
    } else {
  
      res.status(404).json({"error": "item not exist"})
    }
  
  })



  //  npm run dev
