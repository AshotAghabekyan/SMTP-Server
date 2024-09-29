import { AttachedFile, Mail } from "./mailModel";
import  nodeMailer, {Transporter} from "nodemailer"
import { promisify } from "util";
import config from "./consts/config";
import logs from "./consts/logs";
import { FileParsingService } from "./fileParsingService";
import formidable from "formidable"


function createHtmlResponse(mail: Mail): string {
    const message = `
    <html>
    <head>
      <style>
        h3 {
          color: #333;
          font-family: Arial, sans-serif;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div style="text-align: center;">
            <img src="https://darpass.com/wp-content/uploads/2024/05/WCIT-2024-DigiTec-scaled.jpg" alt="WCIT 2024" style="max-width: 100%; height: 200px;">
        </div>
        <h3>${mail.title}</h3>
        <p>${mail.message}</p>
      </div>
      <div class="footer">
        <p>Best regards,<br>WCIT Team</p>
      </div>
    </body>
    </html>
  `
  return message;
}



export class MailSenderService {
    private transporter: Transporter;
    private sendMailPromise: Function;
    private fileParsingService: FileParsingService;

    constructor() {
        this.fileParsingService = new FileParsingService();
        this.transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: config.smtp_host,
        port: config.smtp_port,
        pool: true,
        secure: true,
        maxMessages: 100,
        maxConnections: 50,
        disableFileAccess: false,
        debug: true,
        auth: {
            "user": config.smtp_sender_email,
            "pass": config.email_app_password,
        }
      })

      this.transporter.verify((err) => {
        if (err) {
            console.log(err);
            throw new Error(logs.error.smtp_connection)
        }
        console.log(logs.success.smtp_connection)
      });

      this.sendMailPromise = promisify(this.transporter.sendMail.bind(this.transporter));
    }



    public async sendMail(mails: Mail[], attachedRawFiles: formidable.File[]): Promise<boolean> {
        try {
            // console.log("file --->", attachedRawFiles);
            let parsedAttachedFiles: AttachedFile[] = null;
            if (attachedRawFiles.length > 0) {
              parsedAttachedFiles = this.fileParsingService.parse(attachedRawFiles);
            }
            const promises: Promise<any>[] = mails.map((mail: Mail) => {
                const message = {
                    priority: "high",
                    from: `WCIT <${config.smtp_sender_email}>`,
                    to: mail.email,
                    subject: mail.title,
                    html: createHtmlResponse(mail),
                    attachments: parsedAttachedFiles,
                };
                const promise = this.sendMailPromise(message);
                return promise;
            })
                
            const result: PromiseSettledResult<any>[] = await Promise.allSettled(promises);
            const accpetedMails = this.parseFulfilledEmails(result);
            return accpetedMails.length == mails.length? true : false;
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }


    private parseFulfilledEmails(settledMails: PromiseSettledResult<any>[]) {
        let acceptedMails: string[] = settledMails.map((settledMail) => {
            if (settledMail.status == 'fulfilled') {
                return settledMail['value']['accepted'].toString()
            }
        })
        return acceptedMails;
    };
};