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
exports.editUser = exports.deleteUser = exports.followUnfollowUser = exports.signOutAll = exports.signOut = exports.SignIn = exports.signUp = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const boom = __importStar(require("@hapi/boom"));
const signUp = (userAttributes) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_1.User.findOne({ email: userAttributes.email });
    if (userExists) {
        throw boom.conflict("User already exists");
    }
    const user = new user_1.User(userAttributes);
    const newUser = yield user.save();
    return newUser;
});
exports.signUp = signUp;
const SignIn = (userCredentials) => __awaiter(void 0, void 0, void 0, function* () {
    const myUser = yield user_1.User.findOne({ email: userCredentials.email }); //.select('-tokens');
    if (!myUser) {
        throw boom.unauthorized("Invalid Email or Password");
    }
    const isMatch = yield bcrypt_1.default.compare(userCredentials.password, myUser.password);
    if (!isMatch) {
        throw boom.unauthorized("Invalid Email or Password");
    }
    const token = yield myUser.generateWebToken();
    return { myUser, token };
});
exports.SignIn = SignIn;
const signOut = (tokens, currentAccountToken) => __awaiter(void 0, void 0, void 0, function* () {
    const Updatedtokens = tokens.filter((token) => {
        return token.token !== currentAccountToken;
    });
    return Updatedtokens;
});
exports.signOut = signOut;
const signOutAll = () => {
    return [];
};
exports.signOutAll = signOutAll;
const followUnfollowUser = (currentUser, UserToFollowUnfollow) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_1.User.findById(UserToFollowUnfollow);
    if (!user)
        throw boom.notFound("User Not found");
    if (user._id === currentUser._id)
        throw boom.notFound("You cannot follow yourself");
    if (currentUser.following.includes(user._id)) {
        currentUser.following = currentUser.following.filter((id) => { return id.toString() !== user._id.toString(); });
        user.followers = (_a = user.followers) === null || _a === void 0 ? void 0 : _a.filter((id) => { id.toString() !== currentUser._id.toString(); });
        console.log("------User Unfollowed!------");
    }
    else {
        (_b = user.followers) === null || _b === void 0 ? void 0 : _b.unshift(currentUser._id);
        currentUser.following.unshift(UserToFollowUnfollow);
        console.log("------User followed!------");
    }
    yield user.save();
    return currentUser;
});
exports.followUnfollowUser = followUnfollowUser;
const editUser = (currentUser, editInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = user_1.User.findByIdAndUpdate(currentUser._id, editInfo, { new: true });
    return user;
});
exports.editUser = editUser;
const deleteUser = (currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.User.findByIdAndDelete(currentUser._id);
    return { status: "User successfully deleted" };
});
exports.deleteUser = deleteUser;
