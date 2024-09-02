let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/organizer");

router.get("/organizer_profile", controller.organizerDetails); //done

router.get("/leagues_added/:userId", controller.getLeaguesAddedByOrganizer); //done

router.get("/upcoming_events", controller.getUpcomingEvents); //done

router.get("/past_events", controller.getPastEvents); //done

router.get("/event_details", controller.getEventDetails); //done

router.post("/upload_event_result", controller.uploadEventResult); //done

router.get("/past_event_results", controller.getPastEventResults); //done

module.exports = router;
