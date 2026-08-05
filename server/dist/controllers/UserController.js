"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThumbnailbyId = exports.getUsersThumbnails = void 0;
const Thumbnail_js_1 = __importDefault(require("../models/Thumbnail.js"));
// Controllers to get All User Thumbnails
const getUsersThumbnails = async (req, res) => {
    try {
        const { userId } = req.session;
        const thumbnails = await Thumbnail_js_1.default.find({ userId }).sort({ createdAt: -1 });
        res.json({ thumbnails });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.getUsersThumbnails = getUsersThumbnails;
// Controllers to get single Thumbnail of a User
const getThumbnailbyId = async (req, res) => {
    try {
        const { userId } = req.session;
        const { id } = req.params;
        const thumbnail = await Thumbnail_js_1.default.findOne({ userId, _id: id });
        res.json({ thumbnail });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.getThumbnailbyId = getThumbnailbyId;
