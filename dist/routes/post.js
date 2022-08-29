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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = __importStar(require("express"));
const router = express.Router();
exports.router = router;
const post_1 = require("../controllers/post");
const auth_1 = require("../middleware/auth");
const postValidation_1 = require("../validations/postValidation");
router.post('/createPost', postValidation_1.createPostValidator, auth_1.auth, post_1.createPost);
router.post('/sharePost/:id', auth_1.auth, post_1.sharePost);
router.get('/userFeed', auth_1.auth, post_1.getUserFeed);
router.patch('/editPost/:id', auth_1.auth, post_1.editPost);
router.delete('/deletePost/:id', auth_1.auth, post_1.deletePost);
router.post('/likePost/:id', auth_1.auth, post_1.likePost);
