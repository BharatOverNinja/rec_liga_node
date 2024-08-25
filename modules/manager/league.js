"use strict";

const { includes } = require("lodash");
let LeagueModel = require("../models/league"),
  SportsModel = require("../models/sports"),
  LeaguePlayerModel = require("../models/league_player"),
  UserModel = require("../models/user"),
  PointTableModel = require("../models/point_table"),
  apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");

let CreateLeague = async (body, req, res) => {
  try {
    const { name, sport_id, join_privacy, statistics_info } = body;

    // Validate name
    if (!name) {
      return apiResponse.onSuccess(res, "Name is required.", 400, false);
    }

    let fileName = "";
    if (req.file && req.file.filename) {
      fileName = "/uploads/league/" + req.file.filename;
    }

    // Validate sport_id
    if (!sport_id) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid sport id.",
        400,
        false
      );
    }

    let selected_sports = [];
    if (sport_id && sport_id.length > 0) {
      sport_id.forEach((x) => {
        if (!mongoose.Types.ObjectId.isValid(x)) {
          return apiResponse.onSuccess(
            res,
            "Please provide a valid sport id.",
            400,
            false
          );
        }
      });

      selected_sports = sport_id.map((x) => new mongoose.Types.ObjectId(x));
    }

    // Check if sport exists
    const sport = await SportsModel.findById(sport_id);
    if (!sport) {
      return apiResponse.onSuccess(
        res,
        "Selected sport not found.",
        400,
        false
      );
    }

    // Validate join_privacy
    if (!join_privacy || ![1, 2].includes(Number(join_privacy))) {
      return apiResponse.onSuccess(
        res,
        "Please provide valid join_privacy.",
        400,
        false
      );
    }

    // Validate statistics_info
    if (!statistics_info || statistics_info.length === 0) {
      return apiResponse.onSuccess(
        res,
        "statistics_info is required.",
        400,
        false
      );
    }

    let statistics_error = false;
    if (statistics_info) {
      statistics_info.forEach((x) => {
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
      return apiResponse.onSuccess(
        res,
        "Please provide valid statistics_info.",
        400,
        false
      );
    }

    // Create league data
    let createLeagueData = {
      name: name,
      organizer_id: null, // Set this to the appropriate value
      sport_id: selected_sports,
      join_privacy: join_privacy,
      statistics_info: statistics_info,
      image: fileName,
    };

    await LeagueModel.create(createLeagueData);

    return apiResponse.onSuccess(
      res,
      "League created successfully.",
      200,
      true
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while creating the league.",
      500,
      false
    );
  }
};

let LeagueDetail = async (body, req, res) => {
  try {
    const { league_id } = req.params;

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
    let league = await LeagueModel.findById(league_id);
    if (!league) {
      return apiResponse.onSuccess(
        res,
        "Selected league not found.",
        400,
        false
      );
    }

    if (league.image) {
      league.image = process.env.APP_URL + league.image;
    }

    let request_list = await LeaguePlayerModel.find({
      league_id: new mongoose.Types.ObjectId(league_id),
      status: 1, // Pending
    })
      .sort({ created_at: -1 }) // Sort in descending order (newest first)
      .limit(2) // Limit the results to 2 documents
      .populate("player_id"); // Populate the player_id field

    let player_list = await LeaguePlayerModel.find({
      league_id: new mongoose.Types.ObjectId(league_id),
      status: 2, // Accepted
    })
      .sort({ created_at: -1 }) // Sort in descending order (newest first)
      .limit(2)
      .populate("player_id"); // Populate the player_id field

    // Total league player counts
    let league_player_count = await LeaguePlayerModel.countDocuments({
      league_id: new mongoose.Types.ObjectId(league_id),
      status: 2, // Accepted
    });

    let result = {
      league: league,
      league_player_count: league_player_count,
      request_list: request_list,
      player_list: player_list,
    };

    return apiResponse.onSuccess(
      res,
      "League detail fetched successfully.",
      200,
      true,
      result
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while league detail fetching.",
      500,
      false
    );
  }
};

let LeagueJoinRequest = async (body, req, res) => {
  try {
    const { league_id } = req.params;

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
    let league = await LeagueModel.findById(league_id);
    if (!league) {
      return apiResponse.onSuccess(
        res,
        "Selected league not found.",
        400,
        false
      );
    }

    let request_list = await LeaguePlayerModel.find({
      league_id: new mongoose.Types.ObjectId(league_id),
      status: 1, // Pending
    })
      .sort({ created_at: -1 }) // Sort in descending order (newest first)
      .populate("player_id"); // Populate the player_id field

    return apiResponse.onSuccess(
      res,
      "League join player request fetched successfully.",
      200,
      true,
      request_list
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while League join player request detail fetching.",
      500,
      false
    );
  }
};

let LeaguePlayersList = async (body, req, res) => {
  try {
    const { league_id } = req.params;

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
    let league = await LeagueModel.findById(league_id);
    if (!league) {
      return apiResponse.onSuccess(
        res,
        "Selected league not found.",
        400,
        false
      );
    }

    let player_list = await LeaguePlayerModel.find({
      league_id: new mongoose.Types.ObjectId(league_id),
      status: 2, // Accepted
    })
      .sort({ created_at: -1 }) // Sort in descending order (newest first)
      .populate("player_id"); // Populate the player_id field

    return apiResponse.onSuccess(
      res,
      "League player fetched successfully.",
      200,
      true,
      player_list
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while league player fetching.",
      500,
      false
    );
  }
};

let ProcessRequest = async (body, req, res) => {
  try {
    const { league_id, player_id, status } = body;

    // Validate league_id
    if (!league_id || !mongoose.Types.ObjectId.isValid(league_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid league id.",
        400,
        false
      );
    }

    // Validate player_id
    if (!player_id || !mongoose.Types.ObjectId.isValid(player_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid player id.",
        400,
        false
      );
    }

    // Validate player_id
    if (!status || (status && ![2, 3].includes(Number(status)))) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid status.",
        400,
        false
      );
    }

    // Check if sport exists
    let league_request = await LeaguePlayerModel.findOne({
      league_id: new mongoose.Types.ObjectId(league_id),
      player_id: new mongoose.Types.ObjectId(player_id),
    });

    if (!league_request) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid league request data.",
        400,
        false
      );
    }

    league_request.status = Number(status);

    await league_request.save();

    let genmessage = " accepted ";
    if (Number(status) == 3) {
      genmessage = " rejected ";
    }

    return apiResponse.onSuccess(
      res,
      "Pleayer request" + genmessage + "successfully",
      200,
      true
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while creating the league.",
      500,
      false
    );
  }
};

let PlayerDetail = async (body, req, res) => {
  try {
    const { player_id } = req.params;

    // Validate player_id
    if (!player_id || !mongoose.Types.ObjectId.isValid(player_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid player id.",
        400,
        false
      );
    }

    let playerDetails = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(player_id) },
      },
      {
        $lookup: {
          from: "point_table", // Collection name for PointTableModel
          localField: "_id",
          foreignField: "player_id",
          as: "points",
        },
      },
      {
        $unwind: {
          path: "$points",
          preserveNullAndEmptyArrays: true, // Use this if you want players without points to still return
        },
      },
    ]);

    if (!playerDetails || playerDetails.length === 0) {
      return apiResponse.onSuccess(
        res,
        "Selected player not found.",
        400,
        false
      );
    }

    return apiResponse.onSuccess(
      res,
      "Player detail fetched successfully.",
      200,
      true,
      playerDetails[0]
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching the player.",
      500,
      false
    );
  }
};

let ratePlayer = async (body, req, res) => {
  const { playerId, rating, ratedBy } = body;

  try {
    const user = await LeaguePlayerModel.findOne({ player_id: playerId });

    if (!user) {
      return apiResponse.onError(res, "User not found", 404, false);
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

module.exports = {
  CreateLeague: CreateLeague,
  LeagueDetail: LeagueDetail,
  LeagueJoinRequest: LeagueJoinRequest,
  LeaguePlayersList: LeaguePlayersList,
  ProcessRequest: ProcessRequest,
  PlayerDetail: PlayerDetail,
  ratePlayer: ratePlayer,
};
