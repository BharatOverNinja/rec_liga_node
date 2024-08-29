"use strict";

let League = require("../models/league"),
  AttendEvent = require("../models/attend_event"),
  Event = require("../models/event"),
  LeaguePlayerModel = require("../models/league_player"),
  User = require("../models/user"),
  apiResponse = require("../helpers/apiResponse");

let getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.params.userId;

    const leaguePlayer = await LeaguePlayerModel.find({ player_id: userId });

    if (!leaguePlayer || leaguePlayer.length === 0) {
      return apiResponse.onSuccess(res, "No results found.", 404, false);
    }

    const leagueId = leaguePlayer[0].league_id;

    const today = new Date();

    const events = await Event.find({
      league_id: leagueId,
      start_date: { $gte: today },
    })
      .sort({ start_date: 1 })
      .populate({
        path: "league_id",
        select: "-__v",
      });

    if (events.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No upcoming events found.",
        404,
        false
      );
    }

    const formattedEvents = events.map((event) => {
      const formattedEvent = event.toObject(); // Convert Mongoose document to plain JavaScript object
      formattedEvent.league = formattedEvent.league_id; // Rename 'league_id' to 'league'
      delete formattedEvent.league_id; // Remove the old 'league_id' field
      return formattedEvent;
    });

    return apiResponse.onSuccess(
      res,
      "Events fetched successfully.",
      200,
      true,
      formattedEvents
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
    const userId = req.params.userId;
    const now = new Date();

    const attendingEvents = await AttendEvent.find({
      user_id: userId,
      is_attended: false,
      start_date: { $gte: now },
    })
      .populate("event_id")
      .populate({
        path: "league_id",
        select: "-__v",
      })
      .populate("team_id")
      .sort({ start_date: 1 });

    if (attendingEvents.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No events found that the user is attending.",
        404,
        false
      );
    }

    // Rename 'league_id' to 'league' in each attending event
    const formattedEvents = attendingEvents.map((event) => {
      const formattedEvent = event.toObject(); // Convert Mongoose document to plain JavaScript object
      formattedEvent.league = formattedEvent.league_id; // Rename 'league_id' to 'league'
      delete formattedEvent.league_id; // Remove the old 'league_id' field
      return formattedEvent;
    });

    return apiResponse.onSuccess(
      res,
      "Attending events fetched successfully.",
      200,
      true,
      formattedEvents
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching attending events.",
      500,
      false
    );
  }
};

let getPastEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    const now = new Date();

    const pastEvents = await AttendEvent.find({
      user_id: userId,
      is_attended: true,
      end_date: { $lt: now },
    })
      .populate("event_id")
      .populate({
        path: "league_id",
        select: "-__v",
      })
      .populate("team_id")
      .sort({ start_date: 1 });

    if (pastEvents.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No past events found for the user.",
        404,
        false
      );
    }

    const formattedEvents = pastEvents.map((event) => {
      const formattedEvent = event.toObject(); // Convert Mongoose document to plain JavaScript object
      formattedEvent.league = formattedEvent.league_id; // Rename 'league_id' to 'league'
      delete formattedEvent.league_id; // Remove the old 'league_id' field
      return formattedEvent;
    });

    return apiResponse.onSuccess(
      res,
      "Past events fetched successfully.",
      200,
      true,
      formattedEvents
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching past events.",
      500,
      false
    );
  }
};

let getAllLeaguePlayers = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all leagues the user is a part of
    const userLeagues = await LeaguePlayerModel.find({
      player_id: userId,
    });

    // If the user is not part of any leagues
    if (!userLeagues || userLeagues.length === 0) {
      return apiResponse.onSuccess(
        res,
        "User is not part of any leagues.",
        200,
        []
      );
    }

    // Get the league_id(s) of the leagues the user is part of
    const leagueIds = userLeagues.map((league) => league.league_id);

    // Find all players in the same leagues
    const leaguePlayers = await LeaguePlayerModel.find({
      league_id: { $in: leagueIds },
    });

    // Extract player IDs from the results and filter out the current user
    const playerIds = leaguePlayers
      .map((player) => player.player_id)
      .filter((id) => id.toString() !== userId);

    // Fetch user details based on player IDs, excluding the current user
    const users = await User.find({
      _id: { $in: playerIds },
    });

    return apiResponse.onSuccess(res, "Users fetched successfully", 200, users);
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

let getPlayerLeagues = async (req, res) => {
  try {
    const userId = req.params.userId;

    const leaguePlayers = await LeaguePlayerModel.find({
      player_id: userId,
    });

    if (!leaguePlayers || leaguePlayers.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No leagues found for this player",
        200,
        []
      );
    }

    const leagueIds = leaguePlayers.map((lp) => lp.league_id);

    const leagues = await League.find({
      _id: { $in: leagueIds },
    });

    if (!leagues || leagues.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No leagues found for this player",
        200,
        []
      );
    }

    return apiResponse.onSuccess(
      res,
      "Leagues fetched successfully.",
      200,
      true,
      leagues
    );
  } catch (err) {
    console.log("Error fetching leagues for player:", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching leagues",
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

let attendEvent = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { eventId, leagueId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return apiResponse.onError(res, "Event not found", 404, false);
    }

    const existingAttendance = await AttendEvent.findOne({
      user_id: userId,
      event_id: eventId,
    });

    if (existingAttendance) {
      return apiResponse.onError(
        res,
        "User has already attended this event.",
        400,
        false
      );
    }

    const newAttendance = new AttendEvent({
      user_id: userId,
      event_id: eventId,
      league_id: leagueId,
      selection_status: 1,
      is_captain: false,
      is_attended: false,
      start_date: event.start_date,
      end_date: event.end_date,
    });

    await newAttendance.save();

    return apiResponse.onSuccess(
      res,
      "User successfully attended the event.",
      200,
      true
    );
  } catch (err) {
    console.log("Error attending event: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while attending the event.",
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

let getLeaderboard = async (req, res) => {
  try {
    const topPlayers = await User.find({ role: "Player" })
      .sort({ points: -1 })
      .select("profile_picture full_name points wins losses ties")
      .exec();

    if (topPlayers.length === 0) {
      return apiResponse.onSuccess(res, "No players found.", 404, false);
    }

    return apiResponse.onSuccess(
      res,
      "Leaderboard fetched successfully.",
      200,
      true,
      topPlayers
    );
  } catch (err) {
    console.log("Error fetching leaderboard: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching the leaderboard.",
      500,
      false
    );
  }
};

let ratePlayer = async (req, res) => {
  const { playerId, rating, ratedBy } = req.body;

  try {
    const user = await LeaguePlayerModel.findOne({ player_id: playerId });

    if (!user) {
      return apiResponse.onError(res, "Player not found", 404, false);
    }

    user.rating.push({
      ratedBy: ratedBy,
      rating: rating,
    });

    await user.save();

    return apiResponse.onSuccess(res, "Player rated successfully", 200, user);
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

let getPublicLeagues = async (req, res) => {
  try {
    const leagues = await League.find({ join_privacy: 1 });

    if (leagues.length === 0) {
      return apiResponse.onSuccess(res, "No public leagues found.", 404, false);
    }

    return apiResponse.onSuccess(
      res,
      "Public leagues fetched successfully.",
      200,
      true,
      leagues
    );
  } catch (err) {
    console.log("Error fetching public leagues: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching public leagues.",
      500,
      false
    );
  }
};

module.exports = {
  getUpcomingEvents,
  getAttendingEvents,
  getAllLeaguePlayers,
  getPastEvents,
  getPlayerLeagues,
  getLeagueDetails,
  attendEvent,
  rejectEventRequest,
  getLeaderboard,
  ratePlayer,
  getPublicLeagues,
};
