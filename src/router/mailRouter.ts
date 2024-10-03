import { Router } from "express";
import { MailSenderController } from "../controller/mailController";


const senderController = new MailSenderController();
const router = Router();
export default router;
router.post("/manual", senderController.manualUploadHandler.bind(senderController));
router.post('/bulk', senderController.bulkUploadHandler.bind(senderController));
router.post("/csv", senderController.csvUploadHandler.bind(senderController))