"use strict";

let LeagueModel = require("../models/league"),
  SportsModel = require("../models/sports"),
  apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

let CreateLeague = async (body, req, res) => {
  try {
    const { name, sport_id, join_privacy, statistics_info } = body;

    // Validate name
    if (!name) {
      return apiResponse.onSuccess(res, "Name is required.", 400, false);
    }

    // Validate sport_id
    if (!sport_id) {
      return apiResponse.onSuccess(res, "Please provide a valid sport id.", 400, false);
    }

    let selected_sports = []
    if(sport_id && sport_id.length > 0) {
      sport_id.forEach(x => {
        if(!mongoose.Types.ObjectId.isValid(x)) {
          return apiResponse.onSuccess(res, "Please provide a valid sport id.", 400, false);
        }
      })
      
      selected_sports = sport_id.map(x => new mongoose.Types.ObjectId(x))
    }

    // Check if sport exists
    const sport = await SportsModel.findById(sport_id);
    if (!sport) {
      return apiResponse.onSuccess(res, "Selected sport not found.", 400, false);
    }

    // Validate join_privacy
    if (!join_privacy || ![1, 2].includes(Number(join_privacy))) {
      return apiResponse.onSuccess(res, "Please provide valid join_privacy.", 400, false);
    }

    // Validate statistics_info
    if (!statistics_info || statistics_info.length === 0) {
      return apiResponse.onSuccess(res, "statistics_info is required.", 400, false);
    }

    let statistics_error = false;
    if (statistics_info) {
      statistics_info.forEach(x => {
        if (!x.category.trim() || !x.abbreviation.trim() || !x.point.trim()) {
          statistics_error = true;
        }
        if (x.category) {
          x.slug = x.category.toLowerCase();
        }
        if (x.point) {
          x.point = Number(x.point);
        }
      });
    }

    if (statistics_error) {
      return apiResponse.onSuccess(res, "Please provide valid statistics_info.", 400, false);
    }

    // Create league data
    let createLeagueData = {
      name: name,
      organizer_id: null,  // Set this to the appropriate value
      sport_id: selected_sports,
      join_privacy: join_privacy,
      statistics_info: statistics_info,
    };

    await LeagueModel.create(createLeagueData);

    return apiResponse.onSuccess(res, "League created successfully.", 200, true);
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(res, "An error occurred while creating the league.", 500, false);
  }
};
module.exports = {
  CreateLeague:CreateLeague
};
