let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/organizer");

router.get("/organizer_profile", controller.organizerDetails);

router.get("/leagues_added/:userId", controller.getLeaguesAddedByOrganizer);

router.get("/upcoming_events/:organizerId", controller.getUpcomingEvents);

router.get("/past_events_with_results/:organizerId", controller.getPastEventsWhereResultHasUploaded);

router.get("/past_events_without_results/:organizerId", controller.getPastEventsWhereResultNotUploaded);

router.get("/event_details", controller.getEventDetails);

router.get("/draft_team", controller.organizerDraftTeam);

router.post("/upload_event_result", controller.uploadEventResult);

module.exports = router;
