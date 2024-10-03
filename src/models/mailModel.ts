import { ReadStream } from "fs";
import { AttachedFile } from "./attachedFile";



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

