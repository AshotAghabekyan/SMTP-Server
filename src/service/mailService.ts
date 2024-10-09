import { Mail } from "../models/mailModel";
import { AttachedFile } from "../models/attachedFile";
import  nodeMailer, {Transporter} from "nodemailer"
import { promisify } from "util";
import config from "../consts/config";
import logs from "../consts/logs";
import { FileParserService, CsvFileParserService } from "./fileService";
import formidable from "formidable"
import {GoogleApis} from "googleapis/build/src/googleapis"
import {GetAccessTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import { GoogleSheet } from "../models/googleSheetModel";
import mailMessageHtml from "../consts/mailMessageHtml";



let google: GoogleApis = new GoogleApis();


class MailSenderService {
    private transporter: Transporter;
    private sendMailPromise: Function;
    private OAuth2 = google.auth.OAuth2;
    private static instance: MailSenderService;


    private constructor() {
      this.initTransporter()
        .then(() => {
          this.transporter.verify((err) => {
            if (err) {
                console.log(err);
                throw new Error(logs.error.smtp_connection)
            }
            console.log(logs.success.smtp_connection)
          });
    
          this.sendMailPromise = promisify(this.transporter.sendMail.bind(this.transporter));
        })
    }


    public static getMailer() {
      if (!MailSenderService.instance) {
        MailSenderService.instance = new MailSenderService();
      }
      return MailSenderService.instance;
    }


    public async initOauth(clientId: string, clientSecret: string): Promise<GetAccessTokenResponse> {
      const oauth2Client = new this.OAuth2(
        clientId,
        clientSecret,
        "https://developers.google.com/oauthplayground" 
      );

      oauth2Client.setCredentials({'refresh_token': config.google_refresh_token})
      const accessToken: GetAccessTokenResponse = await oauth2Client.getAccessToken();
      return accessToken;
    }



    private async initTransporter(): Promise<Transporter> {
      const clientId: string = config.google_client_id;
      const clientSecret: string = config.google_client_secret;
      const accessToken: GetAccessTokenResponse = await this.initOauth(clientId, clientSecret);

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
          "type": "OAUTH2",
          "clientId": config.google_client_id,
          "clientSecret": config.google_client_secret,
          "accessToken": accessToken.token,
          "refreshToken": config.google_refresh_token,
          "user": config.smtp_sender_email,
      }
    })
    return this.transporter;
  }


    public async sendMail(mail: Mail, attachedFiles?: AttachedFile[]): Promise<boolean> {
        try {
            const message = {
              priority: "high",
              from: `WCIT <${config.smtp_sender_email}>`,
              to: mail.email,
              subject: mail.title,
              html: mailMessageHtml(mail),
              attachments: attachedFiles,
          };
          const sendingResult = await this.sendMailPromise(message);
          return sendingResult;
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }
};



export class ManualUploadService {
  private mailer: MailSenderService = MailSenderService.getMailer();
  private fileParser: FileParserService = new FileParserService();


  public async send(mails: Mail, attachedRawFiles: formidable.File[]) {
    try {
      const attachedFiles: AttachedFile[] = [];
      for (let rawFile of attachedRawFiles) {
        const parsedFile: AttachedFile = this.fileParser.parse(rawFile['path'], rawFile['name']);
        attachedFiles.push(parsedFile);
      }
      
      const isSuccessSending: boolean = await this.mailer.sendMail(mails, attachedFiles);
      return isSuccessSending;
    }
    catch(error) {
      console.log(error);
      return null;
    }
  }
}




export class CsvUploadService {
  private mailer: MailSenderService = MailSenderService.getMailer();
  private csvFileParser: CsvFileParserService = new CsvFileParserService();
  private fileParser: FileParserService = new FileParserService();

  public async send(title: string, message: string, csvFile: formidable.File[], attachedRawFiles: formidable.File[]) {
    try {
      const parsedCsvFile: GoogleSheet[] = await this.csvFileParser.parse(csvFile['path']);
      const attachedFiles: AttachedFile[] = [];

      for (let rawFile of attachedRawFiles) {
        const parsedFile: AttachedFile = this.fileParser.parse(rawFile['path'], rawFile['name']);
        attachedFiles.push(parsedFile);
      }
      
      for (let sheet of parsedCsvFile) {
        const personEmail = sheet.mail;
        const mailEntity: Mail = new Mail(personEmail, title, message);
        let res = await this.mailer.sendMail(mailEntity, attachedFiles);
        return res;
      }
    }
    catch(error) {
      console.log(error);
      return null;
    }
  }
}