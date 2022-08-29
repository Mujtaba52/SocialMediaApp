"use strict";
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
exports.likePost = exports.editPost = exports.deletePost = exports.getUserFeed = exports.sharePost = exports.createPost = void 0;
const post_1 = require("../models/post");
const user_1 = require("../models/user");
const boom_1 = __importDefault(require("@hapi/boom"));
const createPost = (postData, UserId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(Object.assign({}, postData));
    const post = new post_1.Post(Object.assign(Object.assign({}, postData), { postedBy: UserId }));
    const myPost = yield post.save();
    return myPost;
});
exports.createPost = createPost;
const sharePost = (currentUser, PostId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound("Post Not found");
    post.sharedBy.unshift({ user: currentUser._id });
    return post.save();
});
exports.sharePost = sharePost;
const getUserFeed = (currentUser, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentUser.userRole === user_1.role.PREMIUM) {
        let userPosts = [];
        const postArr = yield post_1.Post.find({ $or: [
                { postedBy: currentUser.following }, { 'sharedBy.user': { $in: currentUser.following } }
            ] }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit)).select('-sharedBy').sort({ createdAt: 1, 'sharedBy.sharedAt': 1 });
        // //const sharedByUsersFollowing = await Post.find({sharedBy:currentUser.following})       {createdAt:1,'sharedBy.sharedAt':1} .select('-sharedBy')
        //;(await Post.aggregate()).find
        // let postArr= [...PostedByUsersFollowing,...sharedByUsersFollowing]
        //PostedByUsersFollowing.concat(sharedByUsersFollowing);
        return postArr;
    }
    return { error: "This feature is for premium users only" };
});
exports.getUserFeed = getUserFeed;
const editPost = (currentUser, postUpdate, PostId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let post = yield post_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound("Post Not found");
    if (((_a = post === null || post === void 0 ? void 0 : post.postedBy) === null || _a === void 0 ? void 0 : _a.toString()) !== currentUser._id.toString() && currentUser.userRole !== user_1.role.MODERATOR)
        throw boom_1.default.unauthorized("Users can only edit their own post");
    post = yield post_1.Post.findByIdAndUpdate(PostId, postUpdate, { new: true });
    return post === null || post === void 0 ? void 0 : post.save();
});
exports.editPost = editPost;
const deletePost = (currentUser, PostId) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let post = yield post_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound("Post Not found");
    if (((_b = post === null || post === void 0 ? void 0 : post.postedBy) === null || _b === void 0 ? void 0 : _b.toString()) !== currentUser._id.toString() && currentUser.userRole !== user_1.role.MODERATOR)
        throw boom_1.default.unauthorized("Users can only delete their own post");
    post = yield post_1.Post.findByIdAndDelete(PostId);
    return post;
});
exports.deletePost = deletePost;
const likePost = (currentUser, PostId) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield post_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound("Post Not found");
    if (post.likes.includes(currentUser._id)) {
        post.likes = post.likes.filter((id) => { id.toString() !== currentUser._id.toString(); });
        return post.save();
        console.log("------post unliked!------");
    }
    post.likes.unshift(currentUser._id);
    return post.save();
});
exports.likePost = likePost;
