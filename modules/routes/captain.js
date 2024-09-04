"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/captain");

router.post("/request", controller.ChangeRequestStatus);

router.get("/available_players/:event_id", controller.AvailablePlayers); 

module.exports = router;
