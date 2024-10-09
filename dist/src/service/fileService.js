"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvFileParserService = exports.FileParserService = void 0;
const attachedFile_1 = require("../models/attachedFile");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
class FileParserService {
    parse(pathToFile, name) {
        const readableStream = fs_1.default.createReadStream(`${pathToFile}`, "utf-8");
        const attachedFileModel = new attachedFile_1.AttachedFile(name, readableStream);
        return attachedFileModel;
    }
}
exports.FileParserService = FileParserService;
class CsvFileParserService {
    parse(csvFilePath) {
        return new Promise((resolve, reject) => {
            let parsedGoogleSheets = [];
            const readStream = fs_1.default.createReadStream(csvFilePath, "utf-8");
            readStream
                .pipe((0, csv_parser_1.default)({
                mapHeaders: this.mapHeaders,
                mapValues: this.mapValues,
            }))
                .on("data", (chunk) => {
                parsedGoogleSheets.push(chunk);
            })
                .on("end", () => {
                resolve(parsedGoogleSheets);
            })
                .on("error", (err) => {
                console.log(err);
                reject(err);
            });
        });
    }
    mapHeaders(args) {
        return args.header.toLowerCase().trim();
    }
    ;
    mapValues(args) {
        args.value = args.value.replace(" ", "");
        args.value = args.value.trim();
        return args.value;
    }
    ;
}
exports.CsvFileParserService = CsvFileParserService;
//# sourceMappingURL=fileService.js.map