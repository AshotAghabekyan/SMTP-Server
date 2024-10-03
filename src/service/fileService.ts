import { AttachedFile } from "../models/attachedFile";
import { GoogleSheet } from "../models/googleSheetModel";
import formidable from "formidable";
import fs, { ReadStream } from 'fs';
import csv from "csv-parser";


export class FileParserService {

    public parse(pathToFile: String, name: string): AttachedFile {
        const readableStream: ReadStream = fs.createReadStream(`${pathToFile}`, "utf-8");
        const attachedFileModel = new AttachedFile(name, readableStream);
        return attachedFileModel;
    }
}



export class CsvFileParserService  {

    public parse(csvFilePath: string): Promise<GoogleSheet[]> {
        return new Promise((resolve: Function, reject: Function) => {
            let parsedGoogleSheets: GoogleSheet[] = [];
            const readStream: ReadStream = fs.createReadStream(csvFilePath, "utf-8");
            readStream
                .pipe(csv({
                    mapHeaders: this.mapHeaders,
                    mapValues: this.mapValues,
                }))
                .on("data", (chunk: GoogleSheet) => {
                    parsedGoogleSheets.push(chunk);
                })
                .on("end", () => {
                    resolve(parsedGoogleSheets);
                })
                .on("error", (err) => {
                    console.log(err);
                    reject(err);
                })
        })
    }


    private mapHeaders(args: {header: string, index: number}) {
        return args.header.toLowerCase().trim();
    };


    private mapValues(args: {header: string, index: number, value: string}) {
        args.value = args.value.replace(" ", "");
        args.value = args.value.trim();
        return args.value;
    };
}