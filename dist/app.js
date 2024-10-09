"use strict";
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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const mailRouter_1 = __importDefault(require("./src/router/mailRouter"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_formidable_1 = __importDefault(require("express-formidable"));
dotenv_1.default.config();
const httpsCredentials = {
    cert: fs_1.default.readFileSync('./cert/selfsigned.crt', "utf-8"),
    key: fs_1.default.readFileSync('./cert/selfsigned.key', "utf-8"),
};
console.log(process.env);
const app = (0, express_1.default)();
app.use((0, express_formidable_1.default)({ "multiples": true, "type": "multipart" }));
app.use("/static", express_1.default.static("./static"));
app.use("/mail", mailRouter_1.default);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlFilePath = path_1.default.resolve('./static/home.html');
    const file = yield fs_1.default.promises.readFile(htmlFilePath, "utf-8");
    res.setHeader("Content-type", 'text/html');
    res.status(200).send(file);
    res.end();
}));
const http_port = +process.env.PORT;
const https_port = +process.env.HTTPS_PORT;
const httpsServer = https_1.default.createServer(httpsCredentials, app);
httpsServer.listen(https_port, () => console.log('https server running on ', https_port));
app.listen(http_port, () => console.log('http server running on', http_port));
//# sourceMappingURL=app.js.map