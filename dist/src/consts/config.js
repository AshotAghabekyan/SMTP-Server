"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: +process.env.PORT,
    https_port: +process.env.HTTPS_PORT,
    email_app_password: process.env.EMAIL_APP_PASSWORD,
    smtp_port: +process.env.SMTP_PORT,
    smtp_host: process.env.SMTP_HOST,
    smtp_sender_email: process.env.SMTP_SENDER_EMAIL,
};
//# sourceMappingURL=config.js.map