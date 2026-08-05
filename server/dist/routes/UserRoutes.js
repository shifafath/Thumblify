"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_js_1 = require("../controllers/UserController.js");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const UserRouter = express_1.default.Router();
UserRouter.get('/thumbnails', auth_js_1.default, UserController_js_1.getUsersThumbnails);
UserRouter.get('/thumbnail/:id', auth_js_1.default, UserController_js_1.getThumbnailbyId);
exports.default = UserRouter;
