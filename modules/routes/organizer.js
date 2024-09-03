let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/organizer");

router.get("/organizer_profile", controller.organizerDetails); //done

router.get("/leagues_added/:userId", controller.getLeaguesAddedByOrganizer); //done

router.get("/upcoming_events/:organizerId", controller.getUpcomingEvents); //done

router.get("/past_events_with_results/:organizerId", controller.getPastEventsWhereResultHasUploaded);

router.get("/past_events_without_results/:organizerId", controller.getPastEventsWhereResultNotUploaded);

router.get("/event_details", controller.getEventDetails); //done

router.get("/draft_team", controller.organizerDraftTeam); //done

router.post("/upload_event_result", controller.uploadEventResult); //done

module.exports = router;
