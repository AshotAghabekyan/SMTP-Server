import { ReadStream } from "fs";


export class AttachedFile {
    filename?: string;
    content?: Buffer | ReadStream | string;
    path?: string

    constructor(filename?: string, content?: Buffer | ReadStream | string, path?: string) {
        this.filename = filename;
        this.content = content;
        this.path = path;
    }
}