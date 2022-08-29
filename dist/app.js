"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter = __importStar(require("./routes/user"));
const postRouter = __importStar(require("./routes/post"));
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let bodyParser = require('body-parser');
const app = (0, express_1.default)();
const server = http.createServer(app);
const socketio = require('socket.io');
const { MongoClient } = require("mongodb");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Mujhassan786:connect4@mycluster.fvgee7z.mongodb.net/socialMediaApp?retryWrites=true&w=majority';
const io = socketio(server);
io.on('connection', (socket) => {
    console.log("New Websocket Connection");
    // socket.emit()    //this only emit to a particular client
    // io.emit()        //this emits to all the clients
    //socket.broadcast.emit()   //this emits to all the user except for the current connected one
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            const connection = mongoose_1.default.connection;
            const { db } = mongoose_1.default.connection;
            const posts = connection.collection('posts');
            // open a Change Stream on the "messages" collection
            const changeStream = posts.watch();
            // set up a listener when change events are emitted
            changeStream.on("change", (next) => {
                // process any change event
                switch (next.operationType) {
                    case 'insert':
                        io.emit('newPost', posts);
                        break;
                    case 'update':
                        io.emit('feedUpdate', posts);
                }
            });
        }
        catch (_a) {
            // Ensures that the client will close when you error
            //await client.close();
        }
    });
}
run().catch(console.dir);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user', userRouter.router);
app.use(postRouter.router);
const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express_1.default.static(publicDirectoryPath));
server.listen(4000 || process.env.PORT);
