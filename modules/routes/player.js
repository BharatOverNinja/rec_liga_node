let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/player");

router.get("/upcoming_events/:userId", controller.getUpcomingEvents); //done

router.get("/attending_events/:userId", controller.getAttendingEvents); //done

router.get("/past_events/:userId", controller.getPastEvents); //done

router.get("/all_league_players/:userId", controller.getAllLeaguePlayers); //done

router.post("/rate_player", controller.ratePlayer); //done

router.post("/send_request_to_join_league/:userId", controller.joinLeague); //done

router.get("/player_leagues/:userId", controller.getPlayerLeagues); //done

router.get("/league_details", controller.getLeagueDetails); //done

router.post("/attend_event/:userId", controller.attendEvent); //done

router.get("/leaderboard", controller.getLeaderboard); //done

router.get("/public_leagues", controller.getPublicLeagues); //done

module.exports = router;
