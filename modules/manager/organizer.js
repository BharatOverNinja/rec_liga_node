"use strict";

let User = require("../models/user"),
  apiResponse = require("../helpers/apiResponse"),
  LeaguePlayers = require("../models/league_player"),
  League = require("../models/league"),
  Team = require("../models/team"),
  AttendEvent = require("../models/attend_event"),
  Event = require("../models/event");

let organizerDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return apiResponse.onSuccess(res, "User ID is required.", 400, false);
    }

    let user = User.findOne({ _id: userId });
    if (!user) {
      return apiResponse.onSuccess(res, "User not found.", 404, false);
    }

    return apiResponse.onSuccess(
      res,
      "Organizer details fetched successfully.",
      200,
      true,
      user
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching sports list.",
      500,
      false
    );
  }
};

let getLeaguesAddedByOrganizer = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return apiResponse.onSuccess(
        res,
        "User ID (organizer_id) is required.",
        400,
        false
      );
    }

    // Step 1: Find all leagues added by the organizer
    let leagues = await League.find({ organizer_id: userId });

    if (leagues.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No leagues found for this organizer.",
        404,
        false
      );
    }

    // Step 2: Fetch player count for each league
    const leagueIds = leagues.map((league) => league._id);

    // Find player counts for each league where status is 2 (Accepted)
    const playerCounts = await LeaguePlayers.aggregate([
      {
        $match: {
          league_id: { $in: leagueIds },
          status: 2,
        },
      },
      {
        $group: {
          _id: "$league_id",
          playerCount: { $sum: 1 },
        },
      },
    ]);

    // Step 3: Map player counts to their corresponding leagues
    const playerCountMap = {};
    playerCounts.forEach((count) => {
      playerCountMap[count._id.toString()] = count.playerCount;
    });

    // Step 4: Append player count to each league
    const leaguesWithPlayerCount = leagues.map((league) => {
      return {
        ...league.toObject(),
        playerCount: playerCountMap[league._id.toString()] || 0, // Default to 0 if no players found
      };
    });

    return apiResponse.onSuccess(
      res,
      "Leagues added by organizer fetched successfully.",
      200,
      true,
      leaguesWithPlayerCount
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

let getUpcomingEvents = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    if (!organizerId) {
      return apiResponse.onSuccess(
        res,
        "Organizer ID is required.",
        400,
        false
      );
    }

    const today = new Date();

    // Step 1: Fetch upcoming events with league details
    let events = await Event.find({
      organizer_id: organizerId,
      start_date: { $gte: today },
    })
      .sort({ start_date: 1 })
      .populate({
        path: "league_id", // Field to populate
        select:
          "name location date sport_id join_privacy statistics_info image", // Fields to return from League model
      });

    if (events.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No upcoming events found.",
        404,
        false
      );
    }

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
      "An error occurred while fetching events.",
      500,
      false
    );
  }
};

let getPastEventsWhereResultHasUploaded = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    if (!organizerId) {
      return apiResponse.onSuccess(
        res,
        "Organizer ID is required.",
        400,
        false
      );
    }

    const today = new Date();

    // Query for fetching past events where result, team_a_score, and team_b_score exist
    let events = await Event.find({
      organizer_id: organizerId,
      end_date: { $lt: today },
      result: { $exists: true, $ne: "" }, // Check if 'result' exists and is not empty
      team_a_score: { $exists: true, $ne: "" }, // Check if 'team_a_score' exists and is not empty
      team_b_score: { $exists: true, $ne: "" }, // Check if 'team_b_score' exists and is not empty
    }).sort({ end_date: -1 });

    if (events.length === 0)
      return apiResponse.onSuccess(res, "No past events found.", 404, false);

    let eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        
        let teams = await Team.find({ event_id: event._id });
        // Fetch player details for each team
        let teamsWithPlayers = await Promise.all(
          teams.map(async (team) => {
            let players = await AttendEvent.find({
              team_id: team._id,
              selection_status: 2,
            }) // Only fetch accepted players
              .populate("user_id", "full_name positions")
              .exec();

            return {
              team,
              players,
            };
          })
        );

        return {
          event,
          teams: teamsWithPlayers,
        };
      })
    );


    return apiResponse.onSuccess(
      res,
      "Events fetched successfully.",
      200,
      true,
      eventsWithDetails
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching events.",
      500,
      false
    );
  }
};

let getPastEventsWhereResultNotUploaded = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    if (!organizerId) {
      return apiResponse.onSuccess(
        res,
        "Organizer ID is required.",
        400,
        false
      );
    }

    const today = new Date();

    // Fetch past events where result, team_a_score, and team_b_score are not uploaded
    let events = await Event.find({
      organizer_id: organizerId,
      end_date: { $lt: today },
      $or: [
        { result: { $exists: false } }, // Check if 'result' does not exist
        { result: "" }, // Check if 'result' is an empty string
        { team_a_score: { $exists: false } }, // Check if 'team_a_score' does not exist
        { team_a_score: "" }, // Check if 'team_a_score' is an empty string
        { team_b_score: { $exists: false } }, // Check if 'team_b_score' does not exist
        { team_b_score: "" }, // Check if 'team_b_score' is an empty string
      ],
    }).sort({ end_date: -1 });

    if (events.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No past events found where result has not been uploaded.",
        404,
        false
      );
    }

    // Fetch associated team details and player details for each event
    let eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        
        let teams = await Team.find({ event_id: event._id });
        // Fetch player details for each team
        let teamsWithPlayers = await Promise.all(
          teams.map(async (team) => {
            let players = await AttendEvent.find({
              team_id: team._id,
              selection_status: 2,
            }) // Only fetch accepted players
              .populate("user_id", "full_name positions")
              .exec();

            return {
              team,
              players,
            };
          })
        );

        return {
          event,
          teams: teamsWithPlayers,
        };
      })
    );

    return apiResponse.onSuccess(
      res,
      "Events with team and player details fetched successfully.",
      200,
      true,
      eventsWithDetails
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching events with details.",
      500,
      false
    );
  }
};

let getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return apiResponse.onSuccess(res, "Event ID is required.", 400, false);
    }

    let event = await Event.findOne({ _id: eventId });

    if (!event) {
      return apiResponse.onSuccess(res, "Event not found.", 404, false);
    }

    return apiResponse.onSuccess(
      res,
      "Event details fetched successfully.",
      200,
      true,
      event
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching event details.",
      500,
      false
    );
  }
};

let getPastEventResults = async (req, res) => {
  try {
    const today = new Date();

    let events = await Event.find({
      end_date: { $lt: today },
      result: { $exists: true, $ne: "" },
    });

    return apiResponse.onSuccess(
      res,
      "Past event results fetched successfully.",
      200,
      true,
      events
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching past event results.",
      500,
      false
    );
  }
};

let uploadEventResult = async (req, res) => {
  try {
    const { eventId, result, team_a_score, team_b_score } = req.body;

    if (!eventId) {
      return apiResponse.onSuccess(res, "Event ID is required.", 400, false);
    }

    if (!result) {
      return apiResponse.onSuccess(res, "Result is required.", 400, false);
    }

    if (!team_a_score) {
      return apiResponse.onSuccess(
        res,
        "team_a_score is required.",
        400,
        false
      );
    }

    if (!team_b_score) {
      return apiResponse.onSuccess(
        res,
        "team_b_score is required.",
        400,
        false
      );
    }

    const updatedEventData = {
      result,
      team_a_score,
      team_b_score,
    };

    // Find the event by ID and update the result fields
    let updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      updatedEventData,
      { new: true } // Return the updated document
    );

    if (!updatedEvent) {
      return apiResponse.onSuccess(
        res,
        "Event not found or doesn't belong to the specified league.",
        404,
        false
      );
    }

    return apiResponse.onSuccess(
      res,
      "Event result uploaded successfully.",
      200,
      true,
      updatedEvent
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while uploading the event result.",
      500,
      false
    );
  }
};

module.exports = {
  organizerDetails,
  getLeaguesAddedByOrganizer,
  getUpcomingEvents,
  getPastEventsWhereResultHasUploaded,
  getPastEventsWhereResultNotUploaded,
  getEventDetails,
  getPastEventResults,
  uploadEventResult,
};
