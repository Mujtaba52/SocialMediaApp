import express from "express"
import mongoose from "mongoose"
import * as userRouter from "./routes/user"
import * as postRouter from "./routes/post"
import { any } from "joi";
let bodyParser = require('body-parser');
const app = express();



const MONGODB_URI = 'mongodb+srv://Mujhassan786:connect4@mycluster.fvgee7z.mongodb.net/socialMediaApp?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/user',userRouter.router)
app.use(postRouter.router)

const server = app.listen(4000)
const io = require('socket.io')(server)
io.on('dataUpdation',(socket:any)=>{

})

// const connection = mongoose.connection;

// connection.once("open", () => {
//   console.log("MongoDB database connected");

//   console.log("Setting change streams");
//   const thoughtChangeStream = connection.collection("  ").watch();

//   thoughtChangeStream.on("change", (change) => {
//     switch (change.operationType) {
//       case "insert":
//         const thought = {
//           _id: change.fullDocument._id,
//           name: change.fullDocument.name,
//           description: change.fullDocument.description,
//         };

//         io.of("/api/socket").emit("newThought", thought);
//         break;

//       case "delete":
//         io.of("/api/socket").emit("deletedThought", change.documentKey._id);
//         break;
//     }
//   });
// });
