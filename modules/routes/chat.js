"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/chat");

router.post("/create_group_chat", controller.createGroupChat);
router.get("/get_user_active_groups", controller.getUserActiveGroups);
router.delete("/delete_group_chat", controller.deleteGroupChat);

module.exports = router;
