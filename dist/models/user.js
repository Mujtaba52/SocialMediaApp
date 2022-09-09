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
exports.role = exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const boom = __importStar(require("@hapi/boom"));
dotenv.config();
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
        if (!process.env.JWT_SECRET) {
            throw boom.badRequest('JWT_SECRET missing');
        }
        const token = jsonwebtoken_1.default.sign({ _id: (this._id).toString() }, process.env.JWT_SECRET);
        this.tokens.unshift({ token });
        this.save();
        return token;
    });
};
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield bcrypt_1.default.hash(this.password, 8);
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
    const userObj = this.toObject();
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
