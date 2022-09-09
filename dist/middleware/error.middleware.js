"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, req, res, next) => {
    var _a;
    res.status(((_a = err.output) === null || _a === void 0 ? void 0 : _a.statusCode) || 400).send({ Error: err.message });
};
