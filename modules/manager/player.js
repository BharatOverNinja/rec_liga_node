"use strict";

let Player = require("../models/player"),
  League = require("../models/league"),
  apiResponse = require("../helpers/apiResponse");

let updateUser = async (body, req, res) => {
  const { profile_image, nick_name, date_of_birth, city, sports, positions } =
    body;
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader) {
      return {
        errormessage: "Authorization header missing",
      };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return {
        errormessage: "JWT token missing",
      };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return {
        errormessage: error.message,
      };
    }

    const userId = decoded.id;

    const user = await Player.findById(userId);
    if (!user) {
      return {
        errormessage: "User not found",
      };
    }
    Object.entries({
      profile_image,
      nick_name,
      date_of_birth,
      city,
      sports,
      positions,
    }).forEach(([key, value]) => {
      if (value !== undefined) {
        user[key] = value;
      }
    });

    await user.save();
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while updating user.",
      500,
      false
    );
  }
};

let getUpcomingEvents = async (playerId, req, res) => {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }

    const today = new Date();

    const events = await Event.find({
      players: playerId,
      date: { $gte: today },
    });

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

let getPlayerProfile = async (playerId, req, res) => {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }
    return apiResponse.onSuccess(res, "Player profile fetched", 200, player);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching player profile.",
      500,
      false
    );
  }
};

let getPastEvents = async (playerId, req, res) => {
  try {
    const player = await Player.findById(playerId);

    if (!player) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }
    const today = new Date();

    const events = await Event.find({
      players: playerId,
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

let rateTeammate = async (body, req, res) => {
  const { teammateId, rating } = body.teammateId;

  try {
    const player = await Player.findById(teammateId);
    if (!player) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }
    player.rating = rating;
    await player.save();

    return apiResponse.onSuccess(res, "Player rated successfully", 200, player);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while rating player.",
      500,
      false
    );
  }
};

let getAllLeaguePlayers = async (req, res) => {
  const { leagueId } = req.body;
  try {
    const league = await League.findById(leagueId);
    if (!league) {
      return apiResponse.onError(res, "League not found", 404, false);
    }

    const players = await Player.find({ _id: { $in: league.players } });
    if (players.length === 0)
      return apiResponse.onSuccess(res, "No players found", 404, false);
    return apiResponse.onSuccess(
      res,
      "Players fetched successfully",
      200,
      players
    );
  } catch (err) {
    console.log("err ", err);
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

    const playersWithPoints = await Player.find({
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
  updateUser: updateUser,
  getUpcomingEvents: getUpcomingEvents,
  getPlayerProfile: getPlayerProfile,
  getPastEvents: getPastEvents,
  rateTeammate: rateTeammate,
  getAllLeaguePlayers: getAllLeaguePlayers,
  getPlayerLeagues: getPlayerLeagues,
  getLeagueDetails: getLeagueDetails,
  acceptEventRequest: acceptEventRequest,
  rejectEventRequest: rejectEventRequest,
  getEventRequests: getEventRequests,
  getLeaderBoard: getLeaderBoard,
};
