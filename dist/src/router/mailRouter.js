"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mailController_1 = require("../controller/mailController");
const senderController = new mailController_1.MailSenderController();
const router = (0, express_1.Router)();
exports.default = router;
router.post("/manual", senderController.manualUploadHandler.bind(senderController));
router.post('/bulk', senderController.bulkUploadHandler.bind(senderController));
router.post("/csv", senderController.csvUploadHandler.bind(senderController));
//# sourceMappingURL=mailRouter.js.map