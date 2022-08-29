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
exports.deleteUser = exports.editUser = exports.goPremium = exports.followUnfollowUser = exports.signOutAll = exports.signOut = exports.signIn = exports.signUp = void 0;
const user_1 = require("../models/user");
const userlib = __importStar(require("../lib/user"));
const stripe_1 = __importDefault(require("stripe"));
const publishable_key = 'pk_test_51LY80CC9gE7fmgQgnD7cwXbMpILGuIAppj6EwuN6Vsh4sb3eUEgyvmyYJ0PNXLFoNfzCN5kxEQYjTUWnjye1KdpD00AKCUn3dQ';
const secret_key = 'sk_test_51LY80CC9gE7fmgQgraV8583r0o2CpXBafHrrdbVduKvs1OTaW6KqIhmcIjdIr3UiNleU0IQ6Cqx5iSWPMNQlnBTr00nHOSdE5c';
const stripe = new stripe_1.default(secret_key, { apiVersion: '2022-08-01' });
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield userlib.signUp(req.body);
        res.status(200).send(newUser);
    }
    catch (e) {
        res.status(e.output.statusCode).send({ Error: e.message });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userlib.SignIn(req.body);
        const myUser = user.myUser;
        const token = user.token;
        res.status(200).send({ myUser, token });
    }
    catch (e) {
        res.status(e.output.statusCode).send({ Error: e.message });
    }
});
exports.signIn = signIn;
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user.tokens);
        req.user.tokens = yield userlib.signOut(req.user.tokens, req.token);
        yield req.user.save();
        res.status(200).send({ status: "User Logged out" });
    }
    catch (e) {
        res.status(400).send({ Error: e.message });
    }
});
exports.signOut = signOut;
const signOutAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.tokens = userlib.signOutAll();
        yield req.user.save();
        res.status(200).send({ status: "All Users Logged out" });
    }
    catch (e) {
        res.status(400).send({ Error: e.message });
    }
});
exports.signOutAll = signOutAll;
const followUnfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield userlib.followUnfollowUser(req.user, req.params.id);
        const updateduser = yield user.save();
        res.status(200).send(updateduser);
    }
    catch (e) {
        res.status(((_a = e.output) === null || _a === void 0 ? void 0 : _a.statusCode) || 400).send({ Error: e.message });
    }
});
exports.followUnfollowUser = followUnfollowUser;
const goPremium = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        stripe.customers.create({});
        stripe.charges.create({
            amount: 2500,
            currency: 'usd',
            source: req.body.card,
            receipt_email: req.user.email
        }).then((result) => {
            req.user.userRole = user_1.role.PREMIUM;
            req.user.save();
            res.status(200).send({ status: result.status });
        }).catch((err) => {
            res.status(500).send(err);
        });
    }
    catch (e) {
        res.status(((_b = e.output) === null || _b === void 0 ? void 0 : _b.statusCode) || 400).send({ Error: e.message });
    }
});
exports.goPremium = goPremium;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userlib.editUser(req.user, req.body);
        res.status(200).send(user);
    }
    catch (e) {
        res.status(e.output.statusCode).send({ Error: e.message });
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userlib.deleteUser(req.user);
        res.status(200).send(user);
    }
    catch (e) {
        res.status(e.output.statusCode).send({ Error: e.message });
    }
});
exports.deleteUser = deleteUser;
