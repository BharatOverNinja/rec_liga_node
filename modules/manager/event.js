"use strict";

let LeagueModel = require("../models/league"),
  EventModel = require("../models/event"),
  CaptainModel = require("../models/captain"),
  NotificationModel = require("../models/notification"),
  EventAttandanceModel = require("../models/attend_event"),
  TeamModel = require("../models/team"),
  UserModel = require("../models/user"),
  SportModel = require("../models/sports"),
  {
    sendFirebaseNotification,
    sendFirebaseNotificationOnJoinTeam,
  } = require("../helpers/send_push_notification"),
  apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");

let CreateEvent = async (req, res) => {
  try {
    const {
      league_id,
      title,
      date,
      location,
      // total_teams,
      players_count,
      start_time,
      end_time,
      repeat_event,
      // rvsp_deadline,
    } = req.body;

    if (!league_id || !mongoose.Types.ObjectId.isValid(league_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid league id.",
        400,
        false
      );
    }
    if (!title)
      return apiResponse.onSuccess(res, "Title is required.", 400, false);
    if (!date)
      return apiResponse.onSuccess(res, "Date is required.", 400, false);
    if (!location)
      return apiResponse.onSuccess(res, "Location is required.", 400, false);
    if (!players_count)
      return apiResponse.onSuccess(
        res,
        "Players count is required.",
        400,
        false
      );
    if (!start_time)
      return apiResponse.onSuccess(res, "Start time is required.", 400, false);
    if (!end_time)
      return apiResponse.onSuccess(res, "End time is required.", 400, false);
    if (!repeat_event || !["every_day", "one_time"].includes(repeat_event)) {
      return apiResponse.onSuccess(
        res,
        "Please enter a valid repeat_event value.",
        400,
        false
      );
    }

    const league = await LeagueModel.findById(league_id);
    if (!league) {
      return apiResponse.onSuccess(
        res,
        "Selected league not found.",
        400,
        false
      );
    }

    const adjustedPlayersCount = Number(players_count) * 2;

    const createEventData = {
      organizer_id: league.organizer_id,
      league_id: league._id,
      title,
      date,
      location,
      players_count: adjustedPlayersCount,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      repeat_event,
    };

    let insertedEvent = await EventModel.create(createEventData);

    // send push notification
    await sendFirebaseNotification(
      title,
      "New event created",
      "",
      "event",
      insertedEvent._id,
      insertedEvent
    );

    return apiResponse.onSuccess(res, "Event created successfully.", 200, true);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while creating the event.",
      500,
      false
    );
  }
};

let SportsList = async (req, res) => {
  try {
    const { league_id } = req.body;

    // Validate league_id
    if (!league_id || !mongoose.Types.ObjectId.isValid(league_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid league id.",
        400,
        false
      );
    }

    // Check if sport exists
    const league = await LeagueModel.findById(league_id);
    if (!league) {
      return apiResponse.onSuccess(
        res,
        "Selected league not found.",
        400,
        false
      );
    }

    let sport_id = league.sport_id.map((x) => new mongoose.Types.ObjectId(x));

    let sports_list = await SportModel.find({ _id: sport_id });

    return apiResponse.onSuccess(
      res,
      "Sports list fetched successfully.",
      200,
      true,
      sports_list
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

let ChooseCaptain = async (req, res) => {
  try {
    const { event_id, user_id } = req.body;

    // Validate event_id
    if (!event_id || !mongoose.Types.ObjectId.isValid(event_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid event id.",
        400,
        false
      );
    }

    if (user_id.length > 2) {
      return apiResponse.onSuccess(
        res,
        "You can provide upto 2 ids.",
        400,
        false
      );
    }

    // Validate user_id array
    for (let x of user_id) {
      if (!x || !mongoose.Types.ObjectId.isValid(x)) {
        return apiResponse.onSuccess(
          res,
          "Please provide a valid user id.",
          400,
          false
        );
      }
    }

    // Check if event exists
    const event = await EventModel.findById(event_id);
    if (!event) {
      return apiResponse.onSuccess(
        res,
        "Selected event not found.",
        400,
        false
      );
    }

    // Check if users exist and process captain selection
    for (let x of user_id) {
      const user = await UserModel.findById(x);
      if (!user) {
        return apiResponse.onSuccess(
          res,
          `Selected user not found with id ${x}.`,
          400,
          false
        );
      }

      // Check if a captain request has already been sent for the same user and event
      const already_sent_request = await CaptainModel.findOne({
        event_id: event_id,
        user_id: x,
      });

      if (already_sent_request) {
        return apiResponse.onSuccess(
          res,
          `You have already invited user ${x} for the same event.`,
          400,
          false
        );
      }

      // Check if captains are already chosen for the event
      const captains = await CaptainModel.find({
        event_id: event_id,
        request_status: 2, // Assuming 2 is the status for chosen captains
      });

      if (captains.length >= 2) {
        return apiResponse.onSuccess(
          res,
          "Captains are already chosen for this event.",
          400,
          false
        );
      }

      // Create captain request
      const captainData = {
        event_id: event_id,
        user_id: x,
        request_status: 1, // Assuming 1 is the pending status
      };
      await CaptainModel.create(captainData);

      const createNotificationData = {
        user_id: x,
        detailed_id: event_id,
        type: "became_captain", // 'became_captain'
        title: "Became a captain",
        message: "You Are Selected As Team Captain For " + event.name + ".",
        read_status: false,
        sent_status: 1,
        sent_date: new Date(),
      };

      await NotificationModel.create(createNotificationData);
    }

    return apiResponse.onSuccess(
      res,
      "Captain(s) chosen successfully.",
      200,
      true
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while choosing the captain.",
      500,
      false
    );
  }
};

let CreateTeam = async (body, req, res) => {
  try {
    const { event_id, player_id, captain_id, team_name, shirt_color } = body;

    // Validate event_id
    if (!event_id || !mongoose.Types.ObjectId.isValid(event_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid event ID.",
        400,
        false
      );
    }

    // Validate captain_id
    if (!captain_id || !mongoose.Types.ObjectId.isValid(captain_id)) {
      return apiResponse.onError(
        res,
        "Please provide a valid captain ID.",
        400,
        false
      );
    }

    // Check if the captain exists for the event
    let captains = await CaptainModel.find({ event_id: event_id });
    if (!captains || captains.length === 0) {
      return apiResponse.onError(
        res,
        "Captain is not selected for this event.",
        400,
        false
      );
    }

    // Validate if the provided captain_id is in the list of event captains
    let validCaptain = captains.some(
      (captain) => captain.user_id.toString() === captain_id
    );
    if (!validCaptain) {
      return apiResponse.onError(
        res,
        "Only a team captain can create an event team.",
        400,
        false
      );
    }

    // Check if event exists
    const event = await EventModel.findById(event_id);
    if (!event) {
      return apiResponse.onError(res, "Selected event not found.", 404, false);
    }

    // Validate player_id array
    if (!player_id || !Array.isArray(player_id) || player_id.length === 0) {
      return apiResponse.onError(
        res,
        "Please provide a valid player_id array.",
        400,
        false
      );
    }

    if (player_id.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return apiResponse.onError(
        res,
        "One or more player IDs are invalid.",
        400,
        false
      );
    }

    if (event.players_count && player_id.length > event.players_count) {
      return apiResponse.onError(
        res,
        `You cannot select more than ${event.players_count} players.`,
        400,
        false
      );
    }

    // Validate team_name
    if (!team_name || typeof team_name !== "string") {
      return apiResponse.onError(
        res,
        "Please provide a valid team name.",
        400,
        false
      );
    }

    // Validate shirt_color
    if (!shirt_color || typeof shirt_color !== "string") {
      return apiResponse.onError(
        res,
        "Please provide a valid shirt color.",
        400,
        false
      );
    }

    let captain_event_teams = await TeamModel.findOne({ event_id, captain_id });
    if (captain_event_teams) {
      return apiResponse.onError(
        res,
        "You already have created one team.",
        400,
        false
      );
    }

    // Check if the event already has two teams
    let event_teams = await TeamModel.find({ event_id });
    if (event_teams.length >= 2) {
      return apiResponse.onError(
        res,
        "This event already has two teams. You cannot create more than two teams.",
        400,
        false
      );
    }

    // Create the team
    let created_team = await TeamModel.create({
      event_id,
      team_name,
      captain_id,
      shirt_color,
      turn: false,
    });

    // Update player attendance records
    await Promise.all(
      player_id.map(async (id) => {
        let updateAttendance = await EventAttandanceModel.findOne({
          user_id: id,
          event_id: event_id,
        });
        if (updateAttendance) {
          updateAttendance.team_id = created_team._id;
          updateAttendance.selection_status = 2;
          await updateAttendance.save(); // Ensure the update is saved
        }
      })
    );

    // Assign team to captain
    if (captain_id) {
      let captain = await EventAttandanceModel.findOne({
        user_id: captain_id,
        event_id: event_id,
      });
      if (captain) {
        captain.team_id = created_team._id;
        await captain.save();
      }
      let teams = await TeamModel.findOne({
        event_id: event_id,
        captain_id: { $ne: captain_id },
      });

      if (teams) {
        teams.turn = true;
        teams.save();
      }
    }

    // Send notification on join league
    await sendFirebaseNotificationOnJoinTeam(
      team_name,
      "You have been choosen in " + team_name + " team.",
      "",
      "selected_in_team",
      player_id[0],
      teams
    );

    return apiResponse.onSuccess(res, "Team created successfully.", 200, true);
  } catch (err) {
    console.error("Error: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while creating the team.",
      500,
      false
    );
  }
};

let EditEvent = async (req, res) => {
  const { title, date, location, start_time, end_time } = req.body;
  const eventId = req.params.eventId;

  // Validate Event ID
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return apiResponse.onError(res, "Invalid event ID", 400);
  }

  try {
    // Find the event by ID
    const event = await EventModel.findById(eventId);
    if (!event) {
      return apiResponse.onError(res, "Event not found", 404);
    }

    // Prepare updates
    const updates = {
      title,
      date,
      location,
      start_time,
      end_time,
    };

    // Apply updates to event object
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        event[key] = value;
      }
    });

    await event.save();

    // Send notification on update event
    await sendFirebaseNotification(
      event.title,
      event.title + " evnet updated.",
      "",
      "event",
      event._id,
      event
    );

    return apiResponse.onSuccess(
      res,
      "Event updated successfully",
      200,
      true,
      event
    );
  } catch (err) {
    console.log("Error updating event: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while updating the event.",
      500
    );
  }
};

let UpdateTeam = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { player_id, team_name, shirt_color, remove_player } = req.body;

    // Validate team_id
    if (!team_id || !mongoose.Types.ObjectId.isValid(team_id)) {
      return apiResponse.onError(
        res,
        "Please provide a valid team ID.",
        400,
        false
      );
    }

    // Check if team exists
    const team = await TeamModel.findById(team_id);
    if (!team) {
      return apiResponse.onError(res, "Selected team not found.", 404, false);
    }

    if (team.turn == false) {
      return apiResponse.onSuccess(
        res,
        "It's not your turn to select player, Please wait till other captain select there player.",
        404,
        false
      );
    }

    // Get the associated event
    const event = await EventModel.findById(team.event_id);
    if (!event) {
      return apiResponse.onError(
        res,
        "Associated event not found.",
        404,
        false
      );
    }

    if (
      player_id &&
      player_id.length > 0 &&
      player_id.some((id) => !mongoose.Types.ObjectId.isValid(id))
    ) {
      return apiResponse.onError(
        res,
        "One or more player IDs are invalid.",
        400,
        false
      );
    }

    if (
      remove_player &&
      remove_player.length &&
      remove_player.some((id) => !mongoose.Types.ObjectId.isValid(id))
    ) {
      return apiResponse.onError(
        res,
        "One or more remove player IDs are invalid.",
        400,
        false
      );
    }

    // Remove players
    if (remove_player && remove_player.length > 0) {
      await Promise.all(
        remove_player.map(async (x) => {
          let attendanceRecord = await EventAttandanceModel.findOne({
            event_id: team.event_id,
            selection_status: 2,
            user_id: x,
          });
          if (attendanceRecord) {
            attendanceRecord.selection_status = 1;
            attendanceRecord.team_id = undefined; // Set team_id to undefined instead of deleting it
            await attendanceRecord.save();
          }
        })
      );
    }

    // Check the total number of selected players
    let selected_players = await EventAttandanceModel.find({
      event_id: team.event_id,
      selection_status: 2,
    });
    if (player_id && player_id.length > 0) {
      let total_players_count = selected_players.length + player_id.length;
      if (total_players_count > event.players_count) {
        // Ensure the correct field name for player count
        return apiResponse.onError(
          res,
          `Team player limit is ${event.players_count} and you have already selected ${selected_players.length} players.`,
          400,
          false
        );
      }

      const result = await EventAttandanceModel.findOne({
        event_id: team.event_id,
        selection_status: 2,
        user_id: player_id[0],
        team_id: { $exists: true, $type: "objectId" }, // Checks if team_id exists and is a valid ObjectId
      });

      if (result) {
        return apiResponse.onError(
          res,
          `This player has been already choosen by another captain.`,
          400,
          false
        );
      }
    }

    // Prepare update data
    let updateData = {};
    if (team_name) {
      updateData.team_name = team_name;
    }
    if (shirt_color) {
      updateData.shirt_color = shirt_color;
    }

    // Update the team information
    await TeamModel.updateOne({ _id: team_id }, updateData);

    // Update player attendance records
    if (player_id && player_id.length > 0) {
      await Promise.all(
        player_id.map(async (id) => {
          let updateAttendance = await EventAttandanceModel.findOne({
            user_id: id,
            event_id: team.event_id,
          });
          if (updateAttendance) {
            updateAttendance.team_id = team_id;
            updateAttendance.selection_status = 2;
            await updateAttendance.save(); // Ensure the update is saved
          }
        })
      );
    }

    team.turn = false;
    team.save();

    let get_apponent_team = await TeamModel.findOne({
      event_id: team.event_id,
      captain_id: { $ne: team.captain_id },
    });

    if (team) {
      get_apponent_team.turn = true;
      get_apponent_team.save();
    }

    return apiResponse.onSuccess(res, "Team updated successfully.", 200, true);
  } catch (err) {
    console.error("Error: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while updating the team.",
      500,
      false
    );
  }
};

let GetTeam = async (req, res) => {
  try {
    const { event_id } = req.params;

    if (!event_id || !mongoose.Types.ObjectId.isValid(event_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID." });
    }

    // Fetch teams for the event
    const teams = await TeamModel.find({ event_id })
      .populate("captain_id", "full_name positions profile_picture")
      .lean();

    if (!teams || teams.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No teams found for this event." });
    }

    // Fetch players for each team
    const teamDetails = await Promise.all(
      teams.map(async (team) => {
        const players = await EventAttandanceModel.find({
          event_id,
          team_id: team._id,
          selection_status: 2,
        })
          .populate("user_id", "full_name positions profile_picture")
          .lean();

        // Filter only the necessary player details
        const filteredPlayers = players.map((player) => ({
          _id: player.user_id._id,
          full_name: player.user_id.full_name,
          positions: player.user_id.positions,
          profile_picture: player.user_id.profile_picture,
        }));

        // Find the captain from the players list
        const captain = players.find((player) => player.is_captain);

        return {
          team: {
            _id: team._id,
            team_name: team.team_name,
            shirt_color: team.shirt_color,
            captain_id: team.captain_id,
            event_id: team.event_id,
            turn: team.turn,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
          },
          players: filteredPlayers,
          captain: captain ? captain.user_id : null, // Assign captain details from players if available
        };
      })
    );

    return res.status(200).json({ success: true, teams: teamDetails });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// let GetTeam = async (req, res) => {
//   try {
//     const { event_id } = req.params;
//     if (!event_id || !mongoose.Types.ObjectId.isValid(event_id)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid event ID." });
//     }
//     // Fetch teams for the event
//     const teams = await TeamModel.find({ event_id })
//       .populate("captain_id", "full_name positions profile_picture")
//       .lean();
//     if (!teams || teams.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No teams found for this event." });
//     }
//     // Fetch players for each team
//     const teamDetails = await Promise.all(
//       teams.map(async (team) => {
//         const players = await EventAttandanceModel.find({
//           event_id,
//           team_id: team._id,
//           selection_status: 2,
//         })
//           .populate("user_id", "full_name positions profile_picture")
//           .lean();
//         let captain = players.find((player) => player.is_captain);
//         return {
//           team: {...team},
//           players,
//           captain: captain ? captain.user_id : null,
//         };
//       })
//     );
//     return res.status(200).json({ success: true, teams: teamDetails });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Server error." });
//   }
// };

module.exports = {
  CreateEvent: CreateEvent,
  SportsList: SportsList,
  ChooseCaptain: ChooseCaptain,
  CreateTeam: CreateTeam,
  UpdateTeam: UpdateTeam,
  GetTeam: GetTeam,
  EditEvent,
};
