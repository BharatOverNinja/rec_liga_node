"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/captain");

router.post("/request", controller.ChangeRequestStatus); //done

router.get("/available_players/:event_id", controller.AvailablePlayers); //done 

module.exports = router;
