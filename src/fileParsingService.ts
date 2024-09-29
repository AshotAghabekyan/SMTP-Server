import { AttachedFile } from "./mailModel";
import formidable from "formidable";
import fs, { ReadStream } from 'fs';



export class FileParsingService {


    public parse(rawFiles: formidable.File[]): AttachedFile[] {
        let files: AttachedFile[] = [];
        for (let file of rawFiles) {
            console.log('file in loop', file['path'])
            const readableStream: ReadStream = fs.createReadStream(`${file['path']}`, "utf-8");
            const attachedFileModel = new AttachedFile(file['name'], readableStream);
            files.push(attachedFileModel);
        }
        return files;
    }   
}