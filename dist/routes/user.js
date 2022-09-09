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
const index_1 = require("../helper/index");
const router = express.Router();
exports.router = router;
router.post('/sign_up', userValidations_1.SignUpValidator, (0, index_1.asyncHandler)(user_1.signUp));
router.post('/sign_in', userValidations_1.SignInValidator, (0, index_1.asyncHandler)(user_1.signIn));
router.use(auth_1.auth);
router.post('/sign_out', (0, index_1.asyncHandler)(user_1.signOut));
router.post('/sign_out_all', (0, index_1.asyncHandler)(user_1.signOutAll));
router.post('/:id/follow', (0, index_1.asyncHandler)(user_1.followUser));
router.post('/:id/unfollow', (0, index_1.asyncHandler)(user_1.unfollowUser));
router.post('/go_premium', (0, index_1.asyncHandler)(user_1.goPremium));
router.patch('/', (0, index_1.asyncHandler)(user_1.editUser));
router.delete('/', (0, index_1.asyncHandler)(user_1.deleteUser));
