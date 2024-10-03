"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachedFile = exports.MailResponseInfo = exports.Mail = void 0;
class Mail {
    constructor(email, title, message) {
        this.email = email;
        this.title = title;
        this.message = message;
    }
}
exports.Mail = Mail;
class MailResponseInfo {
}
exports.MailResponseInfo = MailResponseInfo;
class AttachedFile {
    constructor(filename, content, path) {
        this.filename = filename;
        this.content = content;
        this.path = path;
    }
}
exports.AttachedFile = AttachedFile;
//# sourceMappingURL=mailModel.js.map