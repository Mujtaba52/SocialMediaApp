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
exports.Comment = exports.commentSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const commentSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true
    },
    likes: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'user'
        }],
    tag: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'user'
        }],
    postedBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    replies: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'comment',
            autopopulate: true
        }]
});
exports.commentSchema = commentSchema;
// subTitles: [{ type: Schema.ObjectId, ref: 'workstructureSchema (dont know how you called it)' }],
commentSchema.plugin(mongoose_autopopulate_1.default);
const Comment = (0, mongoose_1.model)('comment', commentSchema);
exports.Comment = Comment;
