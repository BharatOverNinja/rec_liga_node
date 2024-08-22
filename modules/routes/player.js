"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/player");

const s3 = {};

const upload = {};

const uploadFields = {};

const handleMulterErrors = {};

router.post(
  "/update_user",
  uploadFields,
  handleMulterErrors,
  controller.updateUser
);

router.get("/profile/:playerId", controller.getPlayerProfile);

router.get("/upcoming_events/:playerId", controller.getUpcomingEvents);

router.get("/past_events/:playerId", controller.getPastEvents);

router.post("/rate_teammate", controller.rateTeammate);

router.get("/all_league_players", controller.getAllLeaguePlayers);

router.get("/player_leagues/:playerId", controller.getPlayerLeagues);

router.get("/league_details", controller.getLeagueDetails);

router.post("/accept_event_request/:playerId", controller.acceptEventRequest);

router.post("/reject_event_request/:playerId", controller.rejectEventRequest);

router.get("/event_requests/:playerId", controller.getEventRequests);

router.get("/leader_board", controller.getLeaderBoard);

module.exports = router;
