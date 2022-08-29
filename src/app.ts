import express from "express"
import mongoose from "mongoose"
import * as userRouter from "./routes/user"
import * as postRouter from "./routes/post"
import { any } from "joi";
import * as http from "http"
import * as path from "path"
import * as dotenv from "dotenv";

dotenv.config();
let bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app)
const socketio = require('socket.io')

const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI ||'mongodb+srv://Mujhassan786:connect4@mycluster.fvgee7z.mongodb.net/socialMediaApp?retryWrites=true&w=majority'



const io = socketio(server)
io.on('connection',(socket:any)=>{  //this is a builtin event
    console.log("New Websocket Connection")
    // socket.emit()    //this only emit to a particular client
    // io.emit()        //this emits to all the clients
    //socket.broadcast.emit()   //this emits to all the user except for the current connected one
 })

async function run() {

    try {
        await mongoose.connect(MONGODB_URI)
        const connection =mongoose.connection
       const { db } = mongoose.connection;
      const posts = connection.collection('posts');
      const changeStream = posts.watch();
  
      changeStream.on("change", (next:any) => {  
          switch (next.operationType) {
              case 'insert':
                io.emit('newPost')
                  break;
              case 'update':
                io.emit('feedUpdate')

          }
      });
  
    } catch {
        //await client.close();
    }
  }
  
  run().catch(console.dir);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/user',userRouter.router)
app.use(postRouter.router)
const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))
server.listen(4000 || process.env.PORT)
