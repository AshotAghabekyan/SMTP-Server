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
exports.MailSenderController = void 0;
const mailService_1 = require("../service/mailService");
const mailModel_1 = require("../models/mailModel");
const logs_1 = __importDefault(require("../consts/logs"));
class MailSenderController {
    constructor() {
        this.csvUploadService = new mailService_1.CsvUploadService();
        this.manualUploadService = new mailService_1.ManualUploadService();
    }
    manualUploadHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailInfo = req.fields;
                let attachedRawFiles = req.files.attachedFiles;
                const destinationEmail = emailInfo.email.toString();
                const title = emailInfo.title.toString();
                const message = emailInfo.message.toString();
                const mail = new mailModel_1.Mail(destinationEmail, title, message);
                if (!attachedRawFiles) {
                    attachedRawFiles = [];
                }
                else if (!Array.isArray(attachedRawFiles)) {
                    attachedRawFiles = [attachedRawFiles];
                }
                let sendingResult = yield this.manualUploadService.send(mail, attachedRawFiles);
                if (sendingResult) {
                    return res.status(204).end();
                }
                throw new Error(logs_1.default.error.mails_couldnt_sent);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    bulkUploadHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailInfo = req.fields;
                let attachedRawFiles = req.files.attachedFiles;
                const destinationEmails = emailInfo.email.toString();
                const title = emailInfo.title.toString();
                const message = emailInfo.message.toString();
                const mail = new mailModel_1.Mail(destinationEmails, title, message);
                if (!attachedRawFiles) {
                    attachedRawFiles = [];
                }
                else if (!Array.isArray(attachedRawFiles)) {
                    attachedRawFiles = [attachedRawFiles];
                }
                let sendingResult = yield this.manualUploadService.send(mail, attachedRawFiles);
                if (sendingResult) {
                    return res.status(204);
                }
                throw new Error(logs_1.default.error.mails_couldnt_sent);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ messsage: error });
            }
        });
    }
    csvUploadHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailInfo = req.fields;
                const title = emailInfo.title.toString();
                const message = emailInfo.message.toString();
                const csvFile = req.files.csvFile;
                let attachedRawFiles = req.files.attachedFiles;
                if (!attachedRawFiles) {
                    attachedRawFiles = [];
                }
                else if (!Array.isArray(attachedRawFiles)) {
                    attachedRawFiles = [attachedRawFiles];
                }
                let sendingResult = yield this.csvUploadService.send(title, message, csvFile, attachedRawFiles);
                if (sendingResult) {
                    return res.status(204);
                }
                throw new Error(logs_1.default.error.mails_couldnt_sent);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error });
            }
        });
    }
}
exports.MailSenderController = MailSenderController;
//# sourceMappingURL=mailController.js.map