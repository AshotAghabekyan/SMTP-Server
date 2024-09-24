import { Router } from "express";
import { MailSenderController } from "./mailController";
// import { MailSenderMiddleware } from "./mailMiddleware";


const senderController = new MailSenderController();
// const senderMiddleware = new MailSenderMiddleware();
const router = Router();
export default router;

// router.use("/", senderMiddleware.parseRequestBody.bind(senderMiddleware));
router.post("/", senderController.sendMail.bind(senderController));