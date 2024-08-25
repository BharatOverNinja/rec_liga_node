"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/event");

router.post("/create", controller.CreateEvent);
router.get("/sports_list", controller.SportsList);
router.post("/choose_captain", controller.ChooseCaptain);
router.post("/create_team", controller.CreateTeam);
router.put("/update_team/:team_id", controller.UpdateTeam);
router.get("/get_team/:event_id", controller.GetTeam);

module.exports = router;
