import { Router } from "express";
import { MailSenderController } from "./mailController";


const senderController = new MailSenderController();
const router = Router();
export default router;
router.post("/", senderController.sendMail.bind(senderController));