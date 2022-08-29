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
exports.likePost = exports.editPost = exports.deletePost = exports.getUserFeed = exports.sharePost = exports.createPost = void 0;
const postlib = __importStar(require("../lib/post"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postlib.createPost(req.body, req.user._id);
    res.status(200).send(post);
});
exports.createPost = createPost;
const sharePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield postlib.sharePost(req.user, req.params.id);
        res.status(200).send(post);
    }
    catch (e) {
        res.status(((_a = e.output) === null || _a === void 0 ? void 0 : _a.statusCode) || 400).send({ Error: e.message });
    }
});
exports.sharePost = sharePost;
const getUserFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { page = 1, limit = 2 } = req.query;
        const posts = yield postlib.getUserFeed(req.user, page, limit);
        res.status(200).send(posts);
    }
    catch (e) {
        res.status(((_b = e.output) === null || _b === void 0 ? void 0 : _b.statusCode) || 400).send({ Error: e.message });
    }
});
exports.getUserFeed = getUserFeed;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const post = yield postlib.editPost(req.user, req.body, req.params.id);
        res.status(200).send(post);
    }
    catch (e) {
        res.status(((_c = e.output) === null || _c === void 0 ? void 0 : _c.statusCode) || 400).send({ Error: e.message });
    }
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const post = yield postlib.deletePost(req.user, req.params.id);
        res.status(200).send(post);
    }
    catch (e) {
        res.status(((_d = e.output) === null || _d === void 0 ? void 0 : _d.statusCode) || 400).send({ Error: e.message });
    }
});
exports.deletePost = deletePost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const post = yield postlib.likePost(req.user, req.params.id);
        res.status(200).send(post);
    }
    catch (e) {
        res.status(((_e = e.output) === null || _e === void 0 ? void 0 : _e.statusCode) || 400).send({ Error: e.message });
    }
});
exports.likePost = likePost;
