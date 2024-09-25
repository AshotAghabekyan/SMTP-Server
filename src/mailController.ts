import { Request, Response } from "express";
import { MailSenderService } from "./mailService";
import { Mail } from "./mailModel";
import logs from "./consts/logs";

export class MailSenderController {
    private mailSenderService: MailSenderService;

    constructor() {
        this.mailSenderService = new MailSenderService();
    }

    public async sendMail(req: Request, res: Response) {
        try {
            const mails:  Mail[] = req.body;
            const sendingResult = await this.mailSenderService.sendMail(mails);
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