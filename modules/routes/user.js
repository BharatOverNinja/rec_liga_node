"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/user");

router.get("/sports_list", controller.SportsList);

module.exports = router;
