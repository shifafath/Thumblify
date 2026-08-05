"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_js_1 = __importDefault(require("./configs/db.js"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const AuthRoutes_js_1 = __importDefault(require("./routes/AuthRoutes.js"));
const ThumbnailRoutes_js_1 = __importDefault(require("./routes/ThumbnailRoutes.js"));
const UserRoutes_js_1 = __importDefault(require("./routes/UserRoutes.js"));
(0, db_js_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    })
}));
app.use(express_1.default.json());
app.use(express_1.default.json());
app.use('/images', express_1.default.static(path_1.default.join(process.cwd(), 'images')));
app.get('/', (req, res) => {
    res.send('Server is Live!');
});
app.use('/api/auth', AuthRoutes_js_1.default);
app.use('/api/thumbnail', ThumbnailRoutes_js_1.default);
app.use('/api/user', UserRoutes_js_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
