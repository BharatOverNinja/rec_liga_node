"use strict";

let User = require("../models/user"),
  apiResponse = require("../helpers/apiResponse"),
  LeaguePlayers = require("../models/league_player"),
  League = require("../models/league"),
  Team = require("../models/team"),
  Captain = require("../models/captain"),
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

// let getUpcomingEvents = async (req, res) => {
//   try {
//     const organizerId = req.params.organizerId;

//     if (!organizerId) {
//       return apiResponse.onSuccess(
//         res,
//         "Organizer ID is required.",
//         400,
//         false
//       );
//     }

//     const today = new Date();

//     // Step 1: Fetch upcoming events with league details
//     let events = await Event.find({
//       organizer_id: organizerId,
//       start_time: { $gte: today },
//     })
//       .sort({ start_date: 1 })
//       .populate({
//         path: "league_id",
//         select:
//           "name location date sport_id join_privacy statistics_info image",
//       });

//     if (events.length === 0) {
//       return apiResponse.onSuccess(
//         res,
//         "No upcoming events found.",
//         404,
//         false
//       );
//     }

//     // Step 2: Fetch team and captain details for events with is_team_drafted = true
//     let eventsWithTeamsAndCaptains = await Promise.all(
//       events.map(async (event) => {
//         // Step 2a: Fetch teams for drafted events
//         let teams = [];
//         if (event.is_team_drafted) {
//           teams = await Team.find({ event_id: event._id });
//         }

//         // Step 2b: Check captain status for the event
//         let captainStatus = "No captains selected";
//         const captains = await Captain.find({ event_id: event._id });

//         if (captains.length === 2) {
//           const captain1Status = captains[0].request_status;
//           const captain2Status = captains[1].request_status;

//           if (captain1Status === 1 || captain2Status === 1) {
//             captainStatus = "Captains selected but invitation pending";
//           } else if (captain1Status === 2 && captain2Status === 2) {
//             captainStatus = "Both captains accepted";
//           } else if (captain1Status === 3 || captain2Status === 3) {
//             captainStatus = "One or both captains declined";
//           }
//         }

//         // Return the event data along with teams and captain status
//         return {
//           ...event._doc, // Spread the event document details
//           teams: teams, // Add teams to the event details
//           captainStatus: captainStatus, // Add captain status to the event details
//         };
//       })
//     );

//     return apiResponse.onSuccess(
//       res,
//       "Events fetched successfully.",
//       200,
//       true,
//       eventsWithTeamsAndCaptains
//     );
//   } catch (err) {
//     console.log("err ", err);
//     return apiResponse.onError(
//       res,
//       "An error occurred while fetching events.",
//       500,
//       false
//     );
//   }
// };

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
      start_time: { $gte: today },
    })
      .sort({ start_date: 1 })
      .populate({
        path: "league_id",
        select:
          "name location date sport_id join_privacy statistics_info image",
      });

    if (events.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No upcoming events found.",
        404,
        false
      );
    }

    // Step 2: Fetch team and captain details for each event
    let eventsWithTeamsAndCaptains = await Promise.all(
      events.map(async (event) => {
        // Step 2a: Fetch teams for the event
        let teams = await Team.find({ event_id: event._id });

        // Step 2b: Fetch players and captains for each team
        let teamsWithPlayers = await Promise.all(
          teams.map(async (team) => {
            let players = await AttendEvent.find({
              team_id: team._id,
              selection_status: 2, // Only fetch accepted players
            })
              .populate("user_id", "full_name positions profile_picture")
              .exec();

            // Extract player user details and captain details
            let playerDetails = players.map((player) => player.user_id);
            let captain = players.find((player) => player.is_captain); // Find the captain

            return {
              team,
              players: playerDetails,
              captain: captain ? captain.user_id : null, // Add captain details if available
            };
          })
        );

        // Step 2c: Check captain status for the event
        let captainStatus = "No captains selected";
        const captains = await Captain.find({ event_id: event._id });

        if (captains.length === 2) {
          const captain1Status = captains[0].request_status;
          const captain2Status = captains[1].request_status;

          if (captain1Status === 1 || captain2Status === 1) {
            captainStatus = "Captains selected but invitation pending";
          } else if (captain1Status === 2 && captain2Status === 2) {
            captainStatus = "Both captains accepted";
          } else if (captain1Status === 3 || captain2Status === 3) {
            captainStatus = "One or both captains declined";
          }
        }

        // Return the event data along with teams, players, and captain status
        return {
          ...event._doc, // Spread the event document details
          teams: teamsWithPlayers, // Add teams with players to the event details
          captainStatus: captainStatus, // Add captain status to the event details
        };
      })
    );

    return apiResponse.onSuccess(
      res,
      "Events fetched successfully.",
      200,
      true,
      eventsWithTeamsAndCaptains
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
      end_time: { $lt: today },
      result: { $exists: true, $ne: "" }, // Check if 'result' exists and is not empty
      team_a_score: { $exists: true, $ne: "" }, // Check if 'team_a_score' exists and is not empty
      team_b_score: { $exists: true, $ne: "" }, // Check if 'team_b_score' exists and is not empty
    }).sort({ end_date: -1 });

    if (events.length === 0) {
      return apiResponse.onSuccess(res, "No past events found.", 404, false);
    }

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
              .populate("user_id", "full_name positions profile_picture") // Populate user details
              .exec();

            // Extract player user details in the correct format
            let formattedPlayers = players.map((player) => player.user_id);
            let captain = players.find((player) => player.is_captain);

            return {
              team,
              players: formattedPlayers,
              captain: captain ? captain.user_id : null, // Include captain details
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
      end_time: { $lt: today },
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
              .populate("user_id", "full_name positions profile_picture")
              .exec();

            let formattedPlayers = players.map((player) => player.user_id);
            let captain = players.find((player) => player.is_captain);

            return {
              team,
              players: formattedPlayers,
              captain: captain ? captain.user_id : null, // Include captain details
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

    // Fetch the event details
    let event = await Event.findOne({ _id: eventId });

    if (!event) {
      return apiResponse.onSuccess(res, "Event not found.", 404, false);
    }

    // Fetch the teams associated with the event
    let teams = await Team.find({ event_id: event._id });

    // Fetch the players for each team including captains
    let teamsWithPlayers = await Promise.all(
      teams.map(async (team) => {
        let players = await AttendEvent.find({
          team_id: team._id,
          selection_status: 2,
        }) // Only fetch accepted players
          .populate("user_id", "full_name positions profile_picture")
          .exec();

        // Extract player user details and captain details
        let playerDetails = players.map((player) => player.user_id);
        let captain = players.find((player) => player.is_captain); // Find the captain

        return {
          team,
          players: playerDetails,
          captain: captain ? captain.user_id : null, // Add captain details if available
        };
      })
    );

    // Include the teams and players in the event details
    let eventDetails = {
      ...event._doc, // Spread the event document details
      teams: teamsWithPlayers,
    };

    return apiResponse.onSuccess(
      res,
      "Event details fetched successfully.",
      200,
      true,
      eventDetails
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

let organizerDraftTeam = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return apiResponse.onSuccess(res, "Event ID is required.", 400, false);
    }

    // Fetch the event details
    let event = await Event.findOne({ _id: eventId });

    if (!event) {
      return apiResponse.onSuccess(res, "Event not found.", 404, false);
    }

    // Fetch all players associated with the event where selection_status is 1
    let players = await AttendEvent.find({
      event_id: event._id,
      selection_status: 1,
    })
      .populate("user_id", "full_name positions profile_picture player_rating")
      .exec();

    // Prepare the event details with players
    let eventDetails = {
      ...event._doc, // Spread the event document details
      players: players.map((player) => player.user_id), // Extract player user details
    };

    return apiResponse.onSuccess(
      res,
      "Event details and players fetched successfully.",
      200,
      true,
      eventDetails
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
  organizerDraftTeam,
  uploadEventResult,
};
