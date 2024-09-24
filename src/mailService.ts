import { Mail } from "./mailModel";
import nodeMailer, {Transporter} from "nodemailer"
import dotenv from "dotenv";
import { promisify } from "util";


dotenv.config();

export class MailSenderService {
    private transporter: Transporter;
    private sendMailPromise: Function;

    constructor() {
            this.transporter = nodeMailer.createTransport({
            service: 'gmail',
            host: "localhost",
            port: 465,
            pool: true,
            secure: true,
            maxMessages: 100,
            maxConnections: 50,
            rateLimit: 10, 
            socketTimeout: 10 * 60 * 1000,
            debug: true,
            disableFileAccess: true,
            auth: {
                "user": "axabekyan.ashot.2003@gmail.com",
                "pass": process.env.MAIL_APP_PASSWORD,
            }
        })

        this.transporter.verify((err) => {
            if (err) {
                console.log(err);
                throw new Error('SMTP Connection is invalid')
            }
            console.log('Successful SMTP Connection')
        });

        this.sendMailPromise = promisify(this.transporter.sendMail.bind(this.transporter));
    }



    public async sendMail(mails: Mail[]): Promise<boolean> {
        try {
            const promises: Promise<any>[] = mails.map((mail: Mail) => {
                const message = {
                    priority: "high",
                    from: "WCIT <axabekyan.ashot.2003@gmail.com>",
                    to: mail.email,
                    subject: mail.title,
                    html: `<h3>${mail.message}</h3>`,
                };
                const promise = this.sendMailPromise(message);
                return promise;
            })
                
        
            const result: PromiseSettledResult<any>[] = await Promise.allSettled(promises);
            const fulfilledEmails: PromiseSettledResult<any>[] = result.filter((settledMail) => settledMail.status == "fulfilled");
            const rejectedEmails: PromiseSettledResult<any>[] = result.filter((settledMail) => settledMail.status == "rejected");
            return fulfilledEmails.length == mails.length? true : false;
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }
    
};