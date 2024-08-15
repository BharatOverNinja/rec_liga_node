"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/event");

router.post("/create", controller.CreateEvent);
router.get("/sports_list", controller.SportsList);

module.exports = router;
