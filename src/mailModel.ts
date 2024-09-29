import { ReadStream } from "fs";



export class Mail {
    email: string;
    title: string;
    message: string;

    constructor(email: string, title: string, message: string) {
        this.email = email;
        this.title = title;
        this.message = message;
    }
}


export class MailResponseInfo {
    accepted: string[];
    rejected: string[];
}


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