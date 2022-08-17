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