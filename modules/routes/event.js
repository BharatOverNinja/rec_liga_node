"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/event");

router.post("/create", controller.CreateEvent); //done

router.get("/sports_list", controller.SportsList); //done

router.post("/choose_captain", controller.ChooseCaptain); //done

router.post("/create_team", controller.CreateTeam); //done

router.put("/update_team/:team_id", controller.UpdateTeam); //done

router.get("/get_team/:event_id", controller.GetTeam); //done

module.exports = router;
