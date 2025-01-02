const express = require("express");
const messageController = require("../controllers/message.controller");
const router = express.Router();

router.post("/", messageController.create);
router.put("/", messageController.updateStatus);
router.get("/", messageController.getConvesations);
router.get("/:conversationId", messageController.getMessages);
router.get("/:conversationId", messageController.getMessages);

module.exports = router;
