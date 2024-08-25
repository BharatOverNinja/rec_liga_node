"use strict";

let League = require("../models/league"),
  AttendEvent = require("../models/attend_event"),
  Event = require("../models/event"),
  LeaguePlayerModel = require("../models/league_player"),
  apiResponse = require("../helpers/apiResponse");

let getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();

    const events = await Event.find({
      start_date: { $gte: today },
    }).sort({ start_date: 1 });

    if (events.length === 0)
      return apiResponse.onSuccess(
        res,
        "No upcoming events found.",
        404,
        false
      );

    return apiResponse.onSuccess(
      res,
      "Events fetched successfully.",
      200,
      true,
      events
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching upcoming events.",
      500,
      false
    );
  }
};

let getAttendingEvents = async (req, res) => {
  try {
    const today = new Date();

    const events = await AttendEvent.find({
      user_id: req.params.userId,
      start_date: { $gte: today },
    }).sort({ start_date: 1 });

    if (events.length === 0)
      return apiResponse.onSuccess(
        res,
        "No upcoming events found.",
        404,
        false
      );

    return apiResponse.onSuccess(
      res,
      "Events fetched successfully.",
      200,
      true,
      events
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching upcoming events.",
      500,
      false
    );
  }
};

let getPastEvents = async (req, res) => {
  try {
    const today = new Date();

    const events = await AttendEvent.find({
      user_id: req.params.userId,
      date: { $lt: today },
    }).sort({ date: -1 });

    if (events.length === 0)
      return apiResponse.onSuccess(res, "No past events found.", 404, false);

    return apiResponse.onSuccess(res, "Past events fetched", 200, events);
  } catch (err) {
    console.error("Error fetching past events:", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching past events.",
      500,
      false
    );
  }
};

let getAllLeaguePlayers = async (req, res) => {
  const { leagueId } = req.body;

  try {
    const leaguePlayers = await LeaguePlayerModel.find({
      league_id: leagueId,
    }).populate("player_id");

    if (!leaguePlayers || leaguePlayers.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No players found for this league",
        200,
        []
      );
    }

    return apiResponse.onSuccess(
      res,
      "Players fetched successfully",
      200,
      leaguePlayers
    );
  } catch (err) {
    console.log("Error fetching players: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching players.",
      500,
      false
    );
  }
};

let getPlayerLeagues = async (playerId, req, res) => {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }

    const leagues = await League.find({ players: playerId });
    if (leagues.length === 0)
      return apiResponse.onSuccess(res, "No leagues found", 404, false);
    return apiResponse.onSuccess(
      res,
      "Leagues fetched successfully",
      200,
      leagues
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching leagues.",
      500,
      false
    );
  }
};

let getLeagueDetails = async (req, res) => {
  const { leagueId } = req.body;
  try {
    const league = await League.findById(leagueId);
    if (!league) {
      return apiResponse.onError(res, "League not found", 404, false);
    }
    return apiResponse.onSuccess(
      res,
      "League fetched successfully",
      200,
      league
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching league.",
      500,
      false
    );
  }
};

let acceptEventRequest = async (playerId, req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId);
    const player = await Player.findById(playerId);
    if (!player) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }

    if (!player.event_requests.includes(eventId)) {
      return apiResponse.onError(res, "No event requests!", 404, false);
    }

    player.event_requests.pull(eventId);
    player.accepted_events.push(eventId);

    if (!event.players.includes(playerId)) {
      event.players.push(playerId);
    }

    await player.save();
    await event.save();
    return apiResponse.onSuccess(res, "Event request accepted", 200, player);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while accepting event request.",
      500,
      false
    );
  }
};

let rejectEventRequest = async (playerId, req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId);
    const player = await Player.findById(playerId);
    if (!player) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }

    if (!player.event_requests.includes(eventId)) {
      return apiResponse.onError(res, "No event requests!", 404, false);
    }

    player.event_requests.pull(eventId);

    await player.save();
    return apiResponse.onSuccess(res, "Event request rejected", 200, player);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while rejecting event request.",
      500,
      false
    );
  }
};

let getEventRequests = async (playerId, req, res) => {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }

    const events = await Event.find({ _id: { $in: player.event_requests } });
    if (events.length === 0)
      return apiResponse.onSuccess(res, "No event requests found", 404, false);
    return apiResponse.onSuccess(
      res,
      "Event requests fetched successfully",
      200,
      events
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching event requests.",
      500,
      false
    );
  }
};

let getLeaderBoard = async (req, res) => {
  const { leagueId } = req.body;
  try {
    const league = await League.findById(leagueId);
    if (!league) {
      return apiResponse.onError(res, "League not found", 404, false);
    }

    const playersWithPoints = await LeaguePlayerModel.find({
      _id: { $in: league.players },
    }).sort({ points: -1 });

    if (playersWithPoints.length === 0)
      return apiResponse.onSuccess(res, "No players found", 404, false);

    return apiResponse.onSuccess(
      res,
      "Leaderboard fetched successfully",
      200,
      playersWithPoints
    );
  } catch (err) {
    console.error("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching leaderboard.",
      500,
      false
    );
  }
};

module.exports = {
  getUpcomingEvents: getUpcomingEvents,
  getAttendingEvents: getAttendingEvents,
  getAllLeaguePlayers: getAllLeaguePlayers,
  getPastEvents: getPastEvents,
  getPlayerLeagues: getPlayerLeagues,
  getLeagueDetails: getLeagueDetails,
  acceptEventRequest: acceptEventRequest,
  rejectEventRequest: rejectEventRequest,
  getEventRequests: getEventRequests,
  getLeaderBoard: getLeaderBoard,
};