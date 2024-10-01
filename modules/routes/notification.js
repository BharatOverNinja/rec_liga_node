"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/notification");

router.post("/send_notification", controller.sendNotification);
router.get("/list/:user_id", controller.NotificationList);
router.get("/clear/:user_id", controller.ClearNotification);
router.post("/read_notification/:user_id", controller.ReadNotification);
router.post("/send_push", controller.SendPush);

module.exports = router;
