"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const createPost = joi_1.default.object({
    description: joi_1.default.string().min(1).required()
});
const createPostValidator = (req, res, next) => {
    const { error } = createPost.validate(req.body);
    if (error)
        return res.status(401).send(error.details);
    next();
};
exports.createPostValidator = createPostValidator;
