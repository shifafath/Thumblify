"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthControllers_js_1 = require("../controllers/AuthControllers.js");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const AuthRouter = express_1.default.Router();
AuthRouter.post('/register', AuthControllers_js_1.registerUser);
AuthRouter.post('/login', AuthControllers_js_1.loginUser);
AuthRouter.get('/verify', auth_js_1.default, AuthControllers_js_1.verifyUser);
AuthRouter.post('/logout', auth_js_1.default, AuthControllers_js_1.logoutUser);
exports.default = AuthRouter;
