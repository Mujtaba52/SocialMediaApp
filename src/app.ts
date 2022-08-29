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

// const client = new MongoClient('mongodb+srv://Mujhassan786:connect4@mycluster.fvgee7z.mongodb.net/socialMediaApp?retryWrites=true&w=majority');  // remove this after you've confirmed it working
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
    //   await client.connect();
      //const database = connection.db('socialMediaApp');
      const posts = connection.collection('posts');
  
      // open a Change Stream on the "messages" collection
      const changeStream = posts.watch();
  
      // set up a listener when change events are emitted
      changeStream.on("change", (next:any) => {  
          // process any change event
          switch (next.operationType) {
              case 'insert':
                  console.log(next.fullDocument.message+" insertion");
                  break;
              case 'update':
                  console.log(next.updateDescription.updatedFields.message+" updation");
          }
      });
  
    } catch {
  
      // Ensures that the client will close when you error
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
