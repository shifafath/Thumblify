"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ThumbnailController_js_1 = require("../controllers/ThumbnailController.js");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const ThumbnailRouter = express_1.default.Router();
ThumbnailRouter.post('/generate', auth_js_1.default, ThumbnailController_js_1.generateThumbnail);
ThumbnailRouter.delete('/delete/:id', auth_js_1.default, ThumbnailController_js_1.deleteThumbnail);
exports.default = ThumbnailRouter;
