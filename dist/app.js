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
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const auth_1 = require("./middleware/auth");
const body_parser_1 = __importDefault(require("body-parser"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
dotenv.config();
const app = (0, express_1.default)();
const MONGODB_URI = process.env.MONGODB_URI;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
io.on('connection', (socket) => {
    console.log('New Websocket Connection');
    // socket.emit()    //this only emit to a particular client
    // io.emit()        //this emits to all the clients
    // socket.broadcast.emit()   //this emits to all the user except for the current connected one
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            const connection = mongoose_1.default.connection;
            const posts = connection.collection('posts');
            const changeStream = posts.watch();
            changeStream.on('change', (next) => {
                switch (next.operationType) {
                    case 'insert':
                        io.emit('newPost');
                        break;
                    case 'update':
                        io.emit('feedUpdate');
                        break;
                    default:
                        break;
                }
            });
        }
        catch (_a) {
            // await client.close();
        }
    });
}
run().catch(console.dir);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/v1/users', userRouter.router);
app.use('/v1/posts', auth_1.auth, postRouter.router);
app.use(error_middleware_1.default);
const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express_1.default.static(publicDirectoryPath));
httpServer.listen(4000 || process.env.PORT);
