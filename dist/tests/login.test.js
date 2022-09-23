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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const supertest_1 = __importDefault(require("supertest"));
const server = __importStar(require("../app"));
chai_1.default.use(chai_http_1.default);
describe('User Sign In', () => {
    // it('should return 404 if  email or password not provided', (done) => {
    //   request(server)
    //     .post('/v1/users/sign_in')
    //     .send({ email: 'jim@gmail.com' })
    //     .end((err: any, response: any) => {
    //       expect(response).to.have.status(404)
    //       expect(response.body).to.contain({
    //         error: 'Invalid Email or Password'
    //       })
    //     })
    // })
    it('should return 404 if  email or password not provided', (done) => {
        (0, supertest_1.default)(server)
            .post('/v1/users/sign_in')
            .send({ email: 'jim@gmail.com' })
            .expect(401, done);
    });
    it('testing', () => {
        console.log('testing unit test cases');
    });
});
