"use strict";
/** Finalized API according to recomendations by ChatGPT about working with module Routing in Express.  */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStoreSession = exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoDB_1 = require("./mongoDB");
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const session_file_store_1 = __importDefault(require("session-file-store"));
const router_v2_1 = __importDefault(require("./routers/router_v2"));
exports.app = (0, express_1.default)();
exports.port = 3005;
exports.FileStoreSession = (0, session_file_store_1.default)(express_session_1.default);
exports.app.use(express_1.default.json());
exports.app.use(body_parser_1.default.json());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, '../static')));
/* app.use(cors({

    origin: 'http://localhost:8080',
    credentials: true

})); */
exports.app.use((0, express_session_1.default)({
    store: new exports.FileStoreSession({ retries: 0 }),
    secret: 'verysecretword',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    }
}));
//app.use ('/api/v1', api_v1);
exports.app.use('/api/v2', router_v2_1.default);
exports.app.listen(exports.port, () => {
    console.log(`The server started and is listening the port ${exports.port}`);
});
(0, mongoDB_1.run)();
// npm start
