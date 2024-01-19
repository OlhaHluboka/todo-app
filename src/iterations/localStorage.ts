import express, { Express } from 'express';
import { Request, Response } from 'express';
import path from 'path';
import bodyParser, { text } from 'body-parser';
import cors from 'cors';


const app: Express = express();
const port: number = 3005;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../static')));
app.use(cors({

  origin: 'http://localhost:3005',
  credentials: true

}));


// Entity (or module) for the first iteration api when we save data in the memory of computer (in array of Objects)
const todoList: { items: { id: number, text: string, checked: boolean }[] } = { items: [] };

// We need to define a new Id to new task every time.
let todoId: number = 0;


// Creates and listens server in the port specified from index.html
app.listen(port, () => {
  console.log(`First iteration - using local storage! This server started and is listening the port ${port}`);
});

// The first route for entity "Todo list". Retrieves to front all todo list and it shows it in browsers.  
app.get('/api/v1/items', (req: Request, res: Response) => {

  res.send(JSON.stringify(todoList));

});

// The second route of todo app. Add the new task in the array (for iteration 1 - in memory of computer.)
// Retrieves to front the new ID of Task.
app.post('/api/v1/items', (req:Request, res:Response) => {

  todoList.items.push({ id: ++todoId, text: req.body.text, checked: false });

  res.send(JSON.stringify({ id: todoId }));
});


// The third route of todo app. Changes a text in the task received from front. Retrieves to front an 
// object {ok: true} 
app.put('/api/v1/items', (req:Request, res:Response) => {

  // Fields for new information from the front.
  let newText: string = req.body.text;
  let newCheck: boolean = req.body.checked;

  // Find the task in our memory structure - array.
  let indexOfTask: number = todoList.items.findIndex((item) => item.id === req.body.id);

  // Changes properties in our object.
  // If index == -1 - this element is not exist in array.
  if (indexOfTask !== -1) {
    todoList.items[indexOfTask].text = newText;
    todoList.items[indexOfTask].checked = newCheck;

    res.status(200).send(JSON.stringify({ ok: true }));
  } else {

    res.status(404).json({"error": "item not exist"})
  }

})

// The fourth route of todo app. Delete the task received from front. Retrieves to front an 
// object {ok: true} 
app.delete('/api/v1/items', (req:Request, res:Response) => {

  // Find the task in our memory structure - array.
  let index: number = todoList.items.findIndex(item => item.id === req.body.id);

  if (index !== -1) {
  // Deletes from array this task.
  todoList.items.splice(index, 1);

  //res.send (JSON.stringify({ok: true}));
  res.status(200).send(JSON.stringify({ ok: true }));
  } else {

    res.status(404).json({"error": "item not exist"})
  }

})

//  npm run dev
