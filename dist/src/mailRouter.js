"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mailController_1 = require("./mailController");
const senderController = new mailController_1.MailSenderController();
const router = (0, express_1.Router)();
exports.default = router;
router.post("/", senderController.sendMail.bind(senderController));
//# sourceMappingURL=mailRouter.js.map