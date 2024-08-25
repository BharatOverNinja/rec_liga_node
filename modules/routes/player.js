let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/player");

router.get("/upcoming_events", controller.getUpcomingEvents);

router.get("/attending_events/:userId", controller.getAttendingEvents);

router.get("/past_events/:userId", controller.getPastEvents);

router.get("/all_league_players", controller.getAllLeaguePlayers);

router.get("/player_leagues/:userId", controller.getPlayerLeagues);

router.get("/league_details", controller.getLeagueDetails);

router.post("/accept_event_request/:userId", controller.acceptEventRequest);

router.post("/reject_event_request/:userId", controller.rejectEventRequest);

router.get("/event_requests/:userId", controller.getEventRequests);

router.get("/leader_board", controller.getLeaderBoard);

module.exports = router;
