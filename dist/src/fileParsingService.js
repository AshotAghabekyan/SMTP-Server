"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileParsingService = void 0;
const mailModel_1 = require("./mailModel");
const fs_1 = __importDefault(require("fs"));
class FileParsingService {
    parse(rawFiles) {
        let files = [];
        for (let file of rawFiles) {
            const readableStream = fs_1.default.createReadStream(`${file['path']}`, "utf-8");
            const attachedFileModel = new mailModel_1.AttachedFile(file['name'], readableStream);
            files.push(attachedFileModel);
        }
        return files;
    }
}
exports.FileParsingService = FileParsingService;
//# sourceMappingURL=fileParsingService.js.map