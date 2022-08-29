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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter = __importStar(require("./routes/user"));
const postRouter = __importStar(require("./routes/post"));
let bodyParser = require('body-parser');
const app = (0, express_1.default)();
const MONGODB_URI = 'mongodb+srv://Mujhassan786:connect4@mycluster.fvgee7z.mongodb.net/socialMediaApp?retryWrites=true&w=majority';
mongoose_1.default.connect(MONGODB_URI);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user', userRouter.router);
app.use(postRouter.router);
const server = app.listen(4000);
// const io = require('socket.io')(server)
// io.on('dataUpdation',(socket:any)=>{
// })
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
