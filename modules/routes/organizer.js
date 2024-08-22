"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/user");

router.get("/organizer_profile", controller.organizerDetails);

router.get("/leagues_added", controller.getLeaguesAddedByOrganizer);

router.get("/upcoming_events", controller.getUpcomingEvents);

router.get("/past_events", controller.getPastEvents);

router.get("/event_details", controller.getEventDetails);

router.post("/upload_event_result", controller.uploadEventResult);

router.get("/past_event_results", controller.getPastEventResults);

module.exports = router;
