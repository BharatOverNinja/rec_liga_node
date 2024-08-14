"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/event");

router.post("/create", controller.CreateEvent);

module.exports = router;
