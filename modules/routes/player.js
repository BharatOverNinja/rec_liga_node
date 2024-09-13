let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/player");

router.get("/upcoming_events/:userId", controller.getUpcomingEvents);

// router.get("/attending_events/:userId", controller.getAttendingEvents);

router.get("/past_events/:userId", controller.getPastEvents);

router.get("/teammates/:userId", controller.getTeammates);

router.get("/all_league_players/:userId", controller.getAllLeaguePlayers);

router.post("/rate_player", controller.ratePlayer);

router.post("/send_request_to_join_league/:userId", controller.joinLeague);

router.get("/player_leagues/:userId", controller.getPlayerLeagues);

router.get("/league_details", controller.getLeagueDetails);

router.post("/attend_event/:userId", controller.attendEvent);

router.get("/leaderboard", controller.getLeaderboard);

router.get("/public_leagues/:userId", controller.getPublicLeagues);

module.exports = router;