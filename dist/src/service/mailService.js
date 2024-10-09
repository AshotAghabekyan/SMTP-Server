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
exports.CsvUploadService = exports.ManualUploadService = void 0;
const mailModel_1 = require("../models/mailModel");
const nodemailer_1 = __importDefault(require("nodemailer"));
const util_1 = require("util");
const config_1 = __importDefault(require("../consts/config"));
const logs_1 = __importDefault(require("../consts/logs"));
const fileService_1 = require("./fileService");
const googleapis_1 = require("googleapis/build/src/googleapis");
const mailMessageHtml_1 = __importDefault(require("../consts/mailMessageHtml"));
let google = new googleapis_1.GoogleApis();
class MailSenderService {
    constructor() {
        this.OAuth2 = google.auth.OAuth2;
        this.initTransporter()
            .then(() => {
            this.transporter.verify((err) => {
                if (err) {
                    console.log(err);
                    throw new Error(logs_1.default.error.smtp_connection);
                }
                console.log(logs_1.default.success.smtp_connection);
            });
            this.sendMailPromise = (0, util_1.promisify)(this.transporter.sendMail.bind(this.transporter));
        });
    }
    static getMailer() {
        if (!MailSenderService.instance) {
            MailSenderService.instance = new MailSenderService();
        }
        return MailSenderService.instance;
    }
    initOauth(clientId, clientSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            const oauth2Client = new this.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");
            oauth2Client.setCredentials({ 'refresh_token': config_1.default.google_refresh_token });
            const accessToken = yield oauth2Client.getAccessToken();
            return accessToken;
        });
    }
    initTransporter() {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = config_1.default.google_client_id;
            const clientSecret = config_1.default.google_client_secret;
            const accessToken = yield this.initOauth(clientId, clientSecret);
            this.transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                host: config_1.default.smtp_host,
                port: config_1.default.smtp_port,
                pool: true,
                secure: true,
                maxMessages: 100,
                maxConnections: 50,
                disableFileAccess: false,
                debug: true,
                auth: {
                    "type": "OAUTH2",
                    "clientId": config_1.default.google_client_id,
                    "clientSecret": config_1.default.google_client_secret,
                    "accessToken": accessToken.token,
                    "refreshToken": config_1.default.google_refresh_token,
                    "user": config_1.default.smtp_sender_email,
                }
            });
            return this.transporter;
        });
    }
    sendMail(mail, attachedFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = {
                    priority: "high",
                    from: `WCIT <${config_1.default.smtp_sender_email}>`,
                    to: mail.email,
                    subject: mail.title,
                    html: (0, mailMessageHtml_1.default)(mail),
                    attachments: attachedFiles,
                };
                const sendingResult = yield this.sendMailPromise(message);
                return sendingResult;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
;
class ManualUploadService {
    constructor() {
        this.mailer = MailSenderService.getMailer();
        this.fileParser = new fileService_1.FileParserService();
    }
    send(mails, attachedRawFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attachedFiles = [];
                for (let rawFile of attachedRawFiles) {
                    const parsedFile = this.fileParser.parse(rawFile['path'], rawFile['name']);
                    attachedFiles.push(parsedFile);
                }
                const isSuccessSending = yield this.mailer.sendMail(mails, attachedFiles);
                return isSuccessSending;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.ManualUploadService = ManualUploadService;
class CsvUploadService {
    constructor() {
        this.mailer = MailSenderService.getMailer();
        this.csvFileParser = new fileService_1.CsvFileParserService();
        this.fileParser = new fileService_1.FileParserService();
    }
    send(title, message, csvFile, attachedRawFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedCsvFile = yield this.csvFileParser.parse(csvFile['path']);
                const attachedFiles = [];
                for (let rawFile of attachedRawFiles) {
                    const parsedFile = this.fileParser.parse(rawFile['path'], rawFile['name']);
                    attachedFiles.push(parsedFile);
                }
                for (let sheet of parsedCsvFile) {
                    const personEmail = sheet.mail;
                    const mailEntity = new mailModel_1.Mail(personEmail, title, message);
                    let res = yield this.mailer.sendMail(mailEntity, attachedFiles);
                    return res;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.CsvUploadService = CsvUploadService;
//# sourceMappingURL=mailService.js.map