"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInValidator = exports.SignUpValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const user_1 = require("../models/user");
const userSignup = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).required(),
    userRole: joi_1.default.string().valid(user_1.role.MEMBER, user_1.role.MODERATOR, user_1.role.PREMIUM)
});
const userSignin = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).required()
});
const SignUpValidator = (req, res, next) => {
    const { error, value } = userSignup.validate(req.body, { abortEarly: false });
    if (error)
        return res.status(401).send(error.details);
    next();
};
exports.SignUpValidator = SignUpValidator;
const SignInValidator = (req, res, next) => {
    const { error, value } = userSignin.validate(req.body, { abortEarly: false });
    if (error)
        return res.status(401).send(error.details);
    next();
};
exports.SignInValidator = SignInValidator;
