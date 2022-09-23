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
exports.getPosts = exports.replyToComments = exports.commentOnPost = exports.unlikePost = exports.likePost = exports.editPost = exports.deletePost = exports.getUserFeed = exports.sharePost = exports.createPost = void 0;
const models_1 = require("../models");
const boom_1 = __importDefault(require("@hapi/boom"));
const createPost = (postData, UserId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new models_1.Post(Object.assign(Object.assign({}, postData), { postedBy: UserId }));
    const myPost = yield post.save();
    return myPost;
});
exports.createPost = createPost;
const getPosts = (UserId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield models_1.Post.find({ postedBy: UserId });
    return post;
});
exports.getPosts = getPosts;
const sharePost = (currentUser, PostId, postData) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield models_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound('Post Not found');
    const sharedpost = new models_1.Post({ description: postData.description, postedBy: currentUser._id, parent: PostId });
    post.sharedBy.unshift(currentUser._id);
    return sharedpost.save();
});
exports.sharePost = sharePost;
const getUserFeed = (currentUser, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentUser.userRole !== models_1.role.PREMIUM) {
        throw boom_1.default.unauthorized('This feature is for premium users only');
    }
    const postArr = yield models_1.Post.find({
        $or: [
            { postedBy: { $in: currentUser.following } },
            { 'comments.postedBy': { $in: currentUser.following } },
            { likes: { $in: currentUser.following } },
            { postedBy: currentUser._id }
        ]
    })
        .populate('parent')
        // .populate({
        //   path: 'comments',
        //   populate: [{
        //     path: 'replies'
        //   }
        //   ]
        // })
        .limit(Number(limit)).skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 });
    return postArr;
});
exports.getUserFeed = getUserFeed;
const editPost = (currentUser, postUpdate, PostId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let post = yield models_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound('Post Not found');
    if (((_a = post === null || post === void 0 ? void 0 : post.postedBy) === null || _a === void 0 ? void 0 : _a.toString()) !== currentUser._id.toString() && currentUser.userRole !== models_1.role.MODERATOR) {
        throw boom_1.default.unauthorized('Users can only edit their own post');
    }
    post = yield models_1.Post.findByIdAndUpdate(PostId, postUpdate, { new: true });
    return post === null || post === void 0 ? void 0 : post.save();
});
exports.editPost = editPost;
const deletePost = (currentUser, PostId) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let post = yield models_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound('Post Not found');
    if (((_b = post === null || post === void 0 ? void 0 : post.postedBy) === null || _b === void 0 ? void 0 : _b.toString()) !== currentUser._id.toString() && currentUser.userRole !== models_1.role.MODERATOR) {
        throw boom_1.default.unauthorized('Users can only delete their own post');
    }
    post = yield models_1.Post.findByIdAndDelete(PostId);
    return post;
});
exports.deletePost = deletePost;
const likePost = (currentUser, PostId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield models_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound('Post Not found');
    if (!post.likes.includes(currentUser._id)) {
        post.likes.unshift(currentUser._id);
        return post.save();
    }
    throw boom_1.default.notAcceptable('Post already liked');
});
exports.likePost = likePost;
const unlikePost = (currentUser, PostId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield models_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound('Post Not found');
    if (post.likes.includes(currentUser._id)) {
        post.likes = post.likes.filter((id) => {
            return id.toString() !== currentUser._id.toString();
        });
        return post.save();
    }
    throw boom_1.default.notAcceptable('Post Not liked');
});
exports.unlikePost = unlikePost;
const commentOnPost = (currentUser, PostId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const post = yield models_1.Post.findById(PostId);
    if (!post)
        throw boom_1.default.notFound('Post Not found');
    const newComment = yield models_1.Comment.create(Object.assign(Object.assign({}, comment), { postedBy: currentUser._id }));
    (_c = post.comments) === null || _c === void 0 ? void 0 : _c.push(newComment._id);
    yield post.save();
    return newComment;
});
exports.commentOnPost = commentOnPost;
const replyToComments = (currentUser, PostId, CommentId, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const comment = yield models_1.Comment.findById(CommentId);
    if (!comment)
        throw boom_1.default.notFound('Comment Not found');
    const newComment = yield models_1.Comment.create(Object.assign(Object.assign({}, reply), { postedBy: currentUser._id }));
    (_d = comment.replies) === null || _d === void 0 ? void 0 : _d.push(newComment._id);
    yield comment.save();
    // post.comments?.filter(comment =>
    //   comment._id && comment._id.toString() === CommentId ? comment.replies?.unshift({ ...reply, tag: comment.postedBy }) : comment)
    return newComment;
});
exports.replyToComments = replyToComments;
