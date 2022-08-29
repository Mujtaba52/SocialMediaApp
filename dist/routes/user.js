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
const user_1 = require("../controllers/user");
const userValidations_1 = require("../validations/userValidations");
const auth_1 = require("../middleware/auth");
const router = express.Router();
exports.router = router;
router.post('/signup', userValidations_1.SignUpValidator, user_1.signUp);
router.post('/signIn', userValidations_1.SignInValidator, user_1.signIn);
router.post('/signOut', auth_1.auth, user_1.signOut);
router.post('/signOutAll', auth_1.auth, user_1.signOutAll);
router.post('/followUnfollow/:id', auth_1.auth, user_1.followUnfollowUser);
router.post('/goPremium', auth_1.auth, user_1.goPremium);
router.patch('/edit', auth_1.auth, user_1.editUser);
router.delete('/delete', auth_1.auth, user_1.deleteUser);
// Build a Social network backend for users to connect and share posts. 
// A user should be able to sign up and follow/unfollow other users. 
// A feed will show all the posts by users we follow.
//  Additionally the feed can be hidden behind a paywall and integrated with stripe to create a subscription or a one time payment option. 
//  Another layer of users could be added to moderate the content on the network.
