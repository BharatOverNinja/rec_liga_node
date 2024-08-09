"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/league");

router.post("/create", controller.CreateLeague);

module.exports = router;
