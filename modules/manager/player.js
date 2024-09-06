"use strict";

let League = require("../models/league"),
  AttendEvent = require("../models/attend_event"),
  Event = require("../models/event"),
  Team = require("../models/team"),
  LeaguePlayerModel = require("../models/league_player"),
  User = require("../models/user"),
  apiResponse = require("../helpers/apiResponse");

let getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch leagues the user has joined
    const leaguePlayers = await LeaguePlayerModel.find({
      player_id: userId,
      status: 2,
    }).select("league_id");

    if (!leaguePlayers || leaguePlayers.length === 0) {
      return apiResponse.onSuccess(res, "No active leagues found!", 404, false);
    }

    const leagueIds = leaguePlayers.map((lp) => lp.league_id);

    // Fetch upcoming events from the leagues the user has joined
    const today = new Date();
    const events = await Event.find({
      league_id: { $in: leagueIds },
      start_time: { $gte: today },
    })
      .sort({ start_date: 1 })
      .populate({
        path: "league_id",
        select: "-__v",
      });

    // Fetch events that the user has already joined
    const attendedEvents = await AttendEvent.find({
      user_id: userId,
      $or: [{ selection_status: 1 }, { selection_status: 2 }],
    }).select("event_id");

    const attendedEventIds = attendedEvents.map((ae) => ae.event_id);

    // Exclude events that the user has already joined
    const filteredEvents = events.filter(
      (event) => !attendedEventIds.includes(event._id.toString())
    );

    if (filteredEvents.length === 0) {
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
      filteredEvents
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
    console.log(now);

    const attendingEvents = await AttendEvent.find({
      user_id: userId,
      is_attended: false,
      start_time: { $gte: now },
    })
      .populate("event_id")
      .populate({
        path: "league_id",
        select: "-__v",
      })
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

    if (!userId) {
      return apiResponse.onSuccess(res, "User ID is required.", 400, false);
    }

    // Step 1: Fetch past events attended by the user
    const pastEvents = await AttendEvent.find({
      user_id: userId,
      is_attended: true,
      end_time: { $lt: now },
    })
      .populate("event_id")
      .sort({ start_time: 1 });

    if (!pastEvents || pastEvents.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No past events found for the user.",
        404,
        false
      );
    }

    // Step 2: Extract event IDs from past events
    const eventIds = pastEvents.map((event) => event.event_id._id);

    // Step 3: Fetch events where results have been uploaded
    const eventsWithResults = await Event.find({
      _id: { $in: eventIds },
      result: { $ne: null },
      team_a_score: { $ne: null },
      team_b_score: { $ne: null },
    });

    if (!eventsWithResults || eventsWithResults.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No past events with results found.",
        404,
        false
      );
    }

    const formattedEvents = await Promise.all(
      eventsWithResults.map(async (event) => {
        const formattedEvent = event.toObject();

        // Step 4: Fetch team details for the event
        const teams = await Team.find({ event_id: event._id }).populate(
          "captain_id",
          "_id full_name profile_picture positions"
        );

        // Step 5: Fetch players for both teams
        const playersInTeams = await AttendEvent.find({
          event_id: event._id,
          team_id: { $in: teams.map((team) => team._id) },
        }).populate("user_id", "_id full_name profile_picture positions"); // Fetch only specific player details

        formattedEvent.teams = teams.map((team) => {
          const teamObject = team.toObject();
          teamObject.players = playersInTeams
            .filter(
              (player) => player.team_id.toString() === team._id.toString()
            )
            .map((player) => player.user_id); // List of players for each team with limited fields
          return teamObject;
        });

        return formattedEvent;
      })
    );

    return apiResponse.onSuccess(
      res,
      "Past events with results fetched successfully.",
      200,
      true,
      formattedEvents
    );
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

let getTeammates = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the last attended event of the user
    const lastAttendedEvent = await AttendEvent.findOne({
      user_id: userId,
      is_attended: true,
    })
      .sort({ end_time: -1 }) // Sort by end_time in descending order to get the last event
      .populate("team_id");

    if (!lastAttendedEvent) {
      return apiResponse.onSuccess(
        res,
        "No past attended events found for the user.",
        404,
        false
      );
    }

    // Extract the team_id from the last attended event
    const teamId = lastAttendedEvent.team_id;

    // Fetch all teammates in the same team
    const teammates = await AttendEvent.find({
      team_id: teamId,
      is_attended: true,
      user_id: { $ne: userId }, // Exclude the current user
    })
      .populate("user_id", "_id full_name profile_picture positions") // Populate only the required user details
      .select("user_id");

    if (teammates.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No teammates found in the user's last event.",
        404,
        false
      );
    }

    const formattedTeammates = teammates.map((teammate) => {
      const formattedTeammate = teammate.user_id.toObject();
      return formattedTeammate;
    });

    return apiResponse.onSuccess(
      res,
      "Teammates fetched successfully.",
      200,
      true,
      formattedTeammates
    );
  } catch (error) {
    console.error("Error fetching teammates: ", error);
    return apiResponse.onError(
      res,
      "An error occurred while fetching teammates.",
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
      status: 2,
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

    // Fetch leagues and count of players who have joined each league
    const leagues = await League.aggregate([
      {
        $match: { _id: { $in: leagueIds } }, // Match the league IDs
      },
      {
        $lookup: {
          from: "league_players", // Lookup from the league_players collection
          localField: "_id", // Local field in the leagues collection
          foreignField: "league_id", // Foreign field in the league_players collection
          as: "players", // Name of the field to add to each league document
        },
      },
      {
        $addFields: {
          playerCount: {
            $size: {
              $filter: {
                input: "$players",
                cond: { $eq: ["$$this.status", 2] }, // Count players with status == 2
              },
            },
          },
        },
      },
      {
        $project: {
          players: 0, // Exclude the players array from the result
        },
      },
    ]);

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

let getAllLeaguePlayers = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all leagues the user is a part of
    const userLeagues = await LeaguePlayerModel.find({
      player_id: userId,
      status: 2,
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
      status: 2,
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

let getLeagueDetails = async (req, res) => {
  const { leagueId } = req.body;
  const today = new Date();
  try {
    // Fetch league details
    const league = await League.findById(leagueId).populate("events"); // Populate the events details
    // .populate({
    //   path: "users",
    //   select:
    //     "full_name profile_picture positions player_rating",
    //   model: "users", // Ensure that Mongoose uses the correct model for players
    // }); // Populate the players' basic details
    // console.log(league);
    if (!league) {
      return apiResponse.onError(res, "League not found", 404, false);
    }

    // Fetch all player IDs associated with the league from league_players collection
    const leaguePlayers = await LeaguePlayerModel.find({
      league_id: leagueId,
      status: 2,
    }).select("player_id");
    // console.log(leaguePlayers)

    const playerIds = leaguePlayers.map((lp) => lp.player_id);
    // console.log(playerIds)
    // Fetch player details from the users collection
    const players = await User.find({ _id: { $in: playerIds } }).select(
      "full_name profile_picture positions player_rating rank points"
    );

    // Fetch all events associated with the league
    const events = await Event.find({
      league_id: leagueId,
      date: { $gte: today },
    });

    // Combine league details, players, and events into one response
    const response = {
      league,
      players,
      events,
    };

    return apiResponse.onSuccess(
      res,
      "League fetched successfully",
      200,
      true,
      response
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

let joinLeague = async (req, res) => {
  const userId = req.params.userId;
  const { leagueId } = req.body;

  try {
    // Find the league by its ID
    const league = await League.findById(leagueId);
    if (!league) {
      return apiResponse.onError(res, "League not found", 404, false);
    }

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return apiResponse.onError(res, "User not found", 404, false);
    }

    // Check if the user is already part of the league
    const existingPlayer = await LeaguePlayerModel.findOne({
      league_id: leagueId,
      player_id: userId,
    });

    if (existingPlayer) {
      return apiResponse.onError(
        res,
        "User is already part of this league.",
        400,
        false
      );
    }

    const newPlayer = new LeaguePlayerModel({
      league_id: leagueId,
      player_id: userId,
      status: 1,
      rating: [],
    });

    // Save the new player document
    await newPlayer.save();

    return apiResponse.onSuccess(
      res,
      "User requested to join league successfully. Awaiting approval.",
      200,
      newPlayer
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while joining league.",
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
      start_time: event.start_time,
      end_time: event.end_time,
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

// let rejectEventRequest = async (playerId, req, res) => {
//   const { eventId } = req.body;
//   try {
//     const event = await Event.findById(eventId);
//     const player = await Player.findById(playerId);
//     if (!player) {
//       return apiResponse.onError(res, "Player not found", 404, false);
//     }

//     if (!player.event_requests.includes(eventId)) {
//       return apiResponse.onError(res, "No event requests!", 404, false);
//     }

//     player.event_requests.pull(eventId);

//     await player.save();
//     return apiResponse.onSuccess(res, "Event request rejected", 200, player);
//   } catch (err) {
//     console.log("err ", err);
//     return apiResponse.onError(
//       res,
//       "An error occurred while rejecting event request.",
//       500,
//       false
//     );
//   }
// };

let getLeaderboard = async (req, res) => {
  try {
    const topPlayers = await User.find({ role: "Player" })
      .sort({ points: -1 })
      .select("profile_picture full_name rank points wins losses ties cw att")
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

const getPublicLeagues = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Step 1: Fetch all public leagues with join_privacy = 1
    const publicLeagues = await League.find({ join_privacy: 1 }).lean();

    // Step 2: Fetch all league IDs where the user has joined
    const userJoinedLeagues = await LeaguePlayerModel.find({
      player_id: userId,
    })
      .select("league_id")
      .lean();
    const userJoinedLeagueIds = userJoinedLeagues.map((lp) =>
      lp.league_id.toString()
    );

    // Step 3: Filter out leagues where the user has already joined
    const leaguesNotJoinedByUser = publicLeagues.filter(
      (league) => !userJoinedLeagueIds.includes(league._id.toString())
    );

    // Check if there are any public leagues that the user has not joined
    if (leaguesNotJoinedByUser.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No public leagues found for this user.",
        404,
        false
      );
    }

    // Step 4: Return the filtered leagues
    return apiResponse.onSuccess(
      res,
      "Public leagues fetched successfully.",
      200,
      true,
      leaguesNotJoinedByUser
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
  getTeammates,
  getPlayerLeagues,
  getLeagueDetails,
  joinLeague,
  attendEvent,
  // rejectEventRequest,
  getLeaderboard,
  ratePlayer,
  getPublicLeagues,
};
