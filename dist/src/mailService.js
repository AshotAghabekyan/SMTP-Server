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
exports.MailSenderService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const util_1 = require("util");
const config_1 = __importDefault(require("./consts/config"));
const logs_1 = __importDefault(require("./consts/logs"));
const fileParsingService_1 = require("./fileParsingService");
function createHtmlResponse(mail) {
    const message = `
    <html>
    <head>
      <style>
        h3 {
          color: #333;
          font-family: Arial, sans-serif;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div style="text-align: center;">
            <img src="https://darpass.com/wp-content/uploads/2024/05/WCIT-2024-DigiTec-scaled.jpg" alt="WCIT 2024" style="max-width: 100%; height: 200px;">
        </div>
        <h3>${mail.title}</h3>
        <p>${mail.message}</p>
      </div>
      <div class="footer">
        <p>Best regards,<br>WCIT Team</p>
      </div>
    </body>
    </html>
  `;
    return message;
}
class MailSenderService {
    constructor() {
        this.fileParsingService = new fileParsingService_1.FileParsingService();
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
                "user": config_1.default.smtp_sender_email,
                "pass": config_1.default.email_app_password,
            }
        });
        this.transporter.verify((err) => {
            if (err) {
                console.log(err);
                throw new Error(logs_1.default.error.smtp_connection);
            }
            console.log(logs_1.default.success.smtp_connection);
        });
        this.sendMailPromise = (0, util_1.promisify)(this.transporter.sendMail.bind(this.transporter));
    }
    sendMail(mails, attachedRawFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let parsedAttachedFiles = null;
                if (attachedRawFiles.length > 0) {
                    parsedAttachedFiles = this.fileParsingService.parse(attachedRawFiles);
                }
                const promises = mails.map((mail) => {
                    const message = {
                        priority: "high",
                        from: `WCIT <${config_1.default.smtp_sender_email}>`,
                        to: mail.email,
                        subject: mail.title,
                        html: createHtmlResponse(mail),
                        attachments: parsedAttachedFiles,
                    };
                    const promise = this.sendMailPromise(message);
                    return promise;
                });
                const result = yield Promise.allSettled(promises);
                const accpetedMails = this.parseFulfilledEmails(result);
                return accpetedMails.length == mails.length ? true : false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    parseFulfilledEmails(settledMails) {
        let acceptedMails = settledMails.map((settledMail) => {
            if (settledMail.status == 'fulfilled') {
                return settledMail['value']['accepted'].toString();
            }
        });
        return acceptedMails;
    }
    ;
}
exports.MailSenderService = MailSenderService;
;
//# sourceMappingURL=mailService.js.map