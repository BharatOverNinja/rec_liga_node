"use strict";

let LeagueModel = require("../models/league"),
  EventModel = require("../models/event"),
  CaptainModel = require("../models/captain"),
  UserModel = require("../models/user"),
  SportModel = require("../models/sports"),
  apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

let CreateEvent = async (body, req, res) => {
  try {
    const { league_id, sport_id, title, date, location, playes_count, start_date, end_date, repeat_event, rvsp_deadline } = body;

    // Validate league_id
    if (!league_id || !mongoose.Types.ObjectId.isValid(league_id)) {
      return apiResponse.onSuccess(res, "Please provide a valid league id.", 400, false);
    }

    // Check if sport exists
    const league = await LeagueModel.findById(league_id);
    if (!league) {
      return apiResponse.onSuccess(res, "Selected league not found.", 400, false);
    }

    if(!league.sport_id.includes(sport_id)) {
      return apiResponse.onSuccess(res, "Selected sport is not found in league.", 400, false);
    }
    
    // Validate name
    if (!title) {
      return apiResponse.onSuccess(res, "title is required.", 400, false);
    }

    // Validate name
    if (!date) {
      return apiResponse.onSuccess(res, "date is required.", 400, false);
    }

    // Validate name
    if (!location) {
      return apiResponse.onSuccess(res, "location is required.", 400, false);
    }

    // Validate name
    if (!playes_count) {
      return apiResponse.onSuccess(res, "playes_count is required.", 400, false);
    }
    
    // Validate name
    if (!start_date) {
      return apiResponse.onSuccess(res, "start_date is required.", 400, false);
    }

    // Validate name
    if (!end_date) {
      return apiResponse.onSuccess(res, "end_date is required.", 400, false);
    }

    // Validate name
    if (!repeat_event || repeat_event && !["every_day", "one_time"].includes(repeat_event)) {
      return apiResponse.onSuccess(res, "Please enter valid repeat_event value.", 400, false);
    }

    // Validate name
    if (!rvsp_deadline) {
      return apiResponse.onSuccess(res, "rvsp_deadline is required.", 400, false);
    }

    // Create league data
    let createEventData = {
      organizer_id: league.organizer_id,
      sport_id: new mongoose.Types.ObjectId(sport_id),
      league_id: new mongoose.Types.ObjectId(league._id),  // Set this to the appropriate value
      title: title,
      date: date,
      location: location,
      playes_count: playes_count,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      repeat_event: repeat_event,
      rvsp_deadline: new Date(rvsp_deadline)
    };

    await EventModel.create(createEventData);

    return apiResponse.onSuccess(res, "Event created successfully.", 200, true);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(res, "An error occurred while creating the event.", 500, false);
  }
};

let SportsList = async (body, req, res) => {
  try {
    const { league_id } = body;

    // Validate league_id
    if (!league_id || !mongoose.Types.ObjectId.isValid(league_id)) {
      return apiResponse.onSuccess(res, "Please provide a valid league id.", 400, false);
    }

    // Check if sport exists
    const league = await LeagueModel.findById(league_id);
    if (!league) {
      return apiResponse.onSuccess(res, "Selected league not found.", 400, false);
    }

    let sport_id = league.sport_id.map(x => new mongoose.Types.ObjectId(x))
    
    let sports_list = await SportModel.find({_id : sport_id})

    return apiResponse.onSuccess(res, "Sports list fetched successfully.", 200, true, sports_list);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(res, "An error occurred while fetching sports list.", 500, false);
  }
};

let ChooseCaptain = async (body, req, res) => {
  try {
    const { event_id, user_id } = body;

    // Validate event_id
    if (!event_id || !mongoose.Types.ObjectId.isValid(event_id)) {
      return apiResponse.onSuccess(res, "Please provide a valid event id.", 400, false);
    }

    // Validate player_id
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return apiResponse.onSuccess(res, "Please provide a valid user id.", 400, false);
    }

    // Check if event exists
    const event = await EventModel.findById(event_id);
    if (!event) {
      return apiResponse.onSuccess(res, "Selected event not found.", 400, false);
    }

    // Check if user exists
    const user = await UserModel.findById(user_id);
    if (!user) {
      return apiResponse.onSuccess(res, "Selected user not found with this id.", 400, false);
    }

    let already_sent_request = await CaptainModel.findOne({event_id : event_id, user_id: user_id})

    if(already_sent_request) {
      return apiResponse.onSuccess(res, "You have already invited same user for same event.", 400, false);
    }

    let captain = await CaptainModel.findOne({event_id : event_id, request_status: 2})

    if(captain) {
      return apiResponse.onSuccess(res, "Captain has been already choosen for this event.", 400, false);
    }

    let captainData = {
      event_id : event_id,
      user_id : user_id,
      request_status : 1
    }
    await CaptainModel.create(captainData)

    return apiResponse.onSuccess(res, "Captain choosen successfully.", 200, true);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(res, "An error occurred while choosing the captain.", 500, false);
  }
};
module.exports = {
  CreateEvent:CreateEvent,
  SportsList: SportsList,
  ChooseCaptain: ChooseCaptain
};
