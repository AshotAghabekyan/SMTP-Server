import { Request, Response } from "express";
import { CsvUploadService, ManualUploadService } from "../service/mailService";
import { Mail } from "../models/mailModel";
import logs from "../consts/logs";
import formidable from "formidable"



export class MailSenderController {
    private manualUploadService: ManualUploadService;
    private csvUploadService: CsvUploadService;

    constructor() {
        this.csvUploadService = new CsvUploadService();
        this.manualUploadService = new ManualUploadService();
    }

    public async manualUploadHandler(req: Request, res: Response) {
        try {
            const emailInfo = req.fields;
            let attachedRawFiles: formidable.File[] = req.files.attachedFiles;
            const destinationEmail = emailInfo.email.toString();
            const title = emailInfo.title.toString();
            const message = emailInfo.message.toString();
            const mail: Mail = new Mail(destinationEmail, title, message);
            
            if (!attachedRawFiles) {
                attachedRawFiles = [];
            }
            else if (!Array.isArray(attachedRawFiles)) {
                attachedRawFiles = [attachedRawFiles]              
            }

            let sendingResult: boolean = await this.manualUploadService.send(mail, attachedRawFiles)
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


    public async bulkUploadHandler(req: Request, res: Response) {
        try {
            const emailInfo = req.fields;
            let attachedRawFiles: formidable.File[] = req.files.attachedFiles;
            const destinationEmails = emailInfo.email.toString();
            const title = emailInfo.title.toString();
            const message = emailInfo.message.toString();
            const mail: Mail = new Mail(destinationEmails, title, message);
            
    
            if (!attachedRawFiles) {
                attachedRawFiles = [];
            }
            else if (!Array.isArray(attachedRawFiles)) {
                attachedRawFiles = [attachedRawFiles]              
            }
    
            let sendingResult = await this.manualUploadService.send(mail, attachedRawFiles)
            if (sendingResult) {
                return res.status(204);
            }
            throw new Error(logs.error.mails_couldnt_sent);
        }
        catch(error) {
            console.log(error);
            res.status(500).json({messsage: error});
        }
    }


    public async csvUploadHandler(req: Request, res: Response) {
        try {
            const csvFile: formidable.File[] = req.files.csvFile;
            let attachedRawFiles: formidable.File[] = req.files.attachedFiles;
    
            if (!attachedRawFiles) {
                attachedRawFiles = [];
            }
            else if (!Array.isArray(attachedRawFiles)) {
                attachedRawFiles = [attachedRawFiles]              
            }
    
            let sendingResult: boolean = await this.csvUploadService.send(csvFile, attachedRawFiles);
            if (sendingResult) {
                return res.status(204);
            }
            throw new Error(logs.error.mails_couldnt_sent);
        }
        catch(error) {
            console.log(error);
            res.status(500).json({message: error});
        }
    }
}