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
exports.role = exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var role;
(function (role) {
    role["MODERATOR"] = "Moderator";
    role["MEMBER"] = "Member";
    role["PREMIUM"] = "Premium";
})(role || (role = {}));
exports.role = role;
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    following: [{
            type: mongoose_1.Types.ObjectId,
            default: []
        }],
    followers: [{
            type: mongoose_1.Types.ObjectId,
            default: []
        }],
    userRole: {
        type: String,
        enum: role,
        default: role.MEMBER
    },
    tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
}, {
    timestamps: true
});
userSchema.methods.generateWebToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ _id: (this._id).toString() }, 'mySecretKey');
        this.tokens.unshift({ token });
        this.save();
        return token;
    });
};
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, 8);
        }
        next();
    });
});
userSchema.virtual('post', {
    ref: 'post',
    localField: '_id',
    foreignField: 'postedBy'
});
userSchema.virtual('post', {
    ref: 'post',
    localField: '_id',
    foreignField: 'sharedBy'
});
userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.id;
    delete userObj.tokens;
    // delete userObj.__v;
    return userObj;
};
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
const User = (0, mongoose_1.model)('user', userSchema);
exports.User = User;
