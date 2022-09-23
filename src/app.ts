import express from 'express'
import mongoose from 'mongoose'
import * as userRouter from './routes/user'
import * as postRouter from './routes/post'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { auth } from './middleware/auth'
import bodyParser from 'body-parser'
import { Server, Socket } from 'socket.io'
import { createServer } from 'http'
import errorMiddleware from './middleware/error.middleware'

dotenv.config()
const app = express()

const MONGODB_URI = <string>process.env.MONGODB_URI

const httpServer = createServer(app)
const io = new Server(httpServer)

async function run() {
  try {
    await mongoose.connect(MONGODB_URI)
    const connection = mongoose.connection
    const posts = connection.collection('posts')
    io.on('connection', (socket: Socket) => { // this is a builtin event
      console.log('New Websocket Connection' + socket.id)
      // io.emit('Added', 'userAdded')
      // socket.emit()    //this only emit to a particular client
      // io.emit()        //this emits to all the clients
      // socket.broadcast.emit()   //this emits to all the user except for the current connected one

      const changeStream = posts.watch()

      changeStream.on('change', (next: any) => {
        switch (next.operationType) {
        case 'insert':
          io.emit('update', 'New Post Added')
          break
        case 'update':
          io.emit('update', 'Post Updated')
          break
        default:
          break
        }
      })
    })
  } catch {
    // await client.close();
  }
}

run().catch(console.dir)
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/home', (req: express.Request, res: express.Response) => {
  res.render('home.ejs')
})
app.use('/v1/users', userRouter.router)
app.use('/v1/posts', auth, postRouter.router)
app.use(errorMiddleware)
const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))
httpServer.listen(4000 || process.env.PORT)
export { app }
