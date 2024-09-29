import { Request, Response } from "express";
import { MailSenderService } from "./mailService";
import { AttachedFile, Mail } from "./mailModel";
import logs from "./consts/logs";
import formidable from "formidable"

export class MailSenderController {
    private mailSenderService: MailSenderService;

    constructor() {
        this.mailSenderService = new MailSenderService();
    }

    public async sendMail(req: Request, res: Response) {
        try {
            const emailInfo = req.fields;
            let attachedRawFiles: formidable.File[] = req.files.attachedFiles;
            console.log('file', attachedRawFiles);
            if (!attachedRawFiles) {
                attachedRawFiles = [];
            }
            else if (!Array.isArray(attachedRawFiles)) {
                attachedRawFiles = [attachedRawFiles]              
            }

            const destinationEmail = emailInfo.email.toString();
            const title = emailInfo.title.toString();
            const message = emailInfo.message.toString();
            const mail: Mail = new Mail(destinationEmail, title, message)

            const sendingResult: boolean = await this.mailSenderService.sendMail([mail], attachedRawFiles);
            if (sendingResult) {
                return res.status(204).end();
            }
            throw new Error(logs.error.mails_couldnt_sent);
        }
        catch(error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    }
}