import { Request, Response } from "express";
import { MailSenderService } from "./mailService";
import { Mail } from "./mailModel";


export class MailSenderController {
    private mailSender: MailSenderService;

    constructor() {
        this.mailSender = new MailSenderService();
    }

    public async sendMail(req: Request, res: Response) {
        try {
            const mails:  Mail[] = req.body;
            const sendingResult = await this.mailSender.sendMail(mails);
            if (sendingResult) {
                return res.status(200).json({message: ""}).end();
            }
            throw new Error(`couldn't send an email to the gmail account(s)`);
        }
        catch(error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    }
}