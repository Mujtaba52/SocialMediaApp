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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.replyToComment = exports.commentOnPost = exports.unlikePost = exports.likePost = exports.editPost = exports.deletePost = exports.getUserFeed = exports.sharePost = exports.createPost = void 0;
const postlib = __importStar(require("../lib/post"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.createPost(req.body, req.user._id);
    res.status(200).send(post);
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.getPosts(req.user._id);
    res.status(200).send(post);
});
exports.getPosts = getPosts;
const sharePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.sharePost(req.user, req.params.id, req.body);
    res.status(200).send(post);
});
exports.sharePost = sharePost;
const getUserFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 2 } = req.query;
    const posts = yield postlib.getUserFeed(req.user, page, limit);
    res.status(200).send(posts);
});
exports.getUserFeed = getUserFeed;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.editPost(req.user, req.body, req.params.id);
    res.status(200).send(post);
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.deletePost(req.user, req.params.id);
    res.status(200).send(post);
});
exports.deletePost = deletePost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.likePost(req.user, req.params.id);
    res.status(200).send(post);
});
exports.likePost = likePost;
const unlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.unlikePost(req.user, req.params.id);
    res.status(200).send(post);
});
exports.unlikePost = unlikePost;
const commentOnPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.commentOnPost(req.user, req.params.id, req.body);
    res.status(200).send(post);
});
exports.commentOnPost = commentOnPost;
const replyToComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.replyToComments(req.user, req.params.id, req.params.commentId, req.body);
    res.status(200).send(post);
});
exports.replyToComment = replyToComment;
