"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/notification");

router.post("/send_notification", controller.sendNotification);
router.get("/list/:user_id", controller.NotificationList);

module.exports = router;
