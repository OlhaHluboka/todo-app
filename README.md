# todo-app
Taks 2.4 from the topic "Primitive servers" in the Node.js course at IT-school "SH++".

Running program on your device have two options:
1. Clone this repository to your pc and run this command in you command line: "npm start" (need to get .env of me)
2. Use Docker, you need to have Docker Dekstop installed. (need to enable Atlas Mongo on my comp)
Use commands:

:~$ docker pull olgavoluntas/todoapp-olga:latest

:~$ docker run -p 3005:3005 <image-id>
 
   // <image-id> needs to change to image-id in your docker desktop, check it by command:
   :~$ docker images

For both variants I use Mongo Atlas database.



