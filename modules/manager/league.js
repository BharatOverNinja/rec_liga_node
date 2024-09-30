"use strict";

let LeagueModel = require("../models/league"),
  SportsModel = require("../models/sports"),
  LeaguePlayerModel = require("../models/league_player"),
  UserModel = require("../models/user"),
  Event = require("../models/event.js"),
  PointTableModel = require("../models/point_table"),
  apiResponse = require("../helpers/apiResponse"),
  { sendFirebaseNotificationOnJoinReqest } = require("..//helpers/send_push_notification"),
  mongoose = require("mongoose");

let getLeagueSportsList = async (req, res) => {
  try {
    const sports = await SportsModel.find(
      { status: 1 },
      { _id: 1, name: 1 }
    ).lean();

    if (sports.length === 0) {
      return apiResponse.onSuccess(res, "No active sports found.", 404, false);
    }

    return apiResponse.onSuccess(
      res,
      "Sports list fetched successfully.",
      200,
      true,
      sports
    );
  } catch (error) {
    console.log("Error fetching sports list: ", error);
    return apiResponse.onError(
      res,
      "An error occurred while fetching sports list.",
      500,
      false
    );
  }
};

let CreateLeague = async (req, res) => {
  try {
    const { name, sport_id, join_privacy } = req.body;
    let statistics_info;

    try {
      // Parse statistics_info from string to JSON
      statistics_info = JSON.parse(req.body.statistics_info);
    } catch (e) {
      return apiResponse.onError(
        res,
        "Invalid statistics_info format.",
        400,
        false
      );
    }

    const userId = req.params.userId;

    // Validate name
    if (!name) {
      return apiResponse.onError(res, "Name is required.", 400, false);
    }

    // Validate and assign fileName
    let fileName = req.file
      ? `http://3.83.218.53/uploads/league/${req.file.filename}`
      : "";

    // Validate sport_id
    if (!sport_id || !mongoose.Types.ObjectId.isValid(sport_id)) {
      return apiResponse.onError(
        res,
        "Please provide a valid sport ID.",
        400,
        false
      );
    }

    // Check if sport exists
    const sport = await SportsModel.findById(sport_id);
    if (!sport) {
      return apiResponse.onError(res, "Selected sport not found.", 400, false);
    }

    // Validate join_privacy
    if (!join_privacy || ![1, 2].includes(Number(join_privacy))) {
      return apiResponse.onError(
        res,
        "Please provide valid join_privacy.",
        400,
        false
      );
    }

    // Validate statistics_info
    if (!Array.isArray(statistics_info) || statistics_info.length === 0) {
      return apiResponse.onError(
        res,
        "Statistics info is required.",
        400,
        false
      );
    }

    // Check for invalid statistics_info entries
    const statistics_error = statistics_info.some(
      (x) => !x.category.trim() || !x.abbreviation.trim() || !x.point.trim()
    );
    if (statistics_error) {
      return apiResponse.onError(
        res,
        "Please provide valid statistics_info.",
        400,
        false
      );
    }

    // Process statistics_info
    const processed_statistics_info = statistics_info.map((x) => ({
      ...x,
      slug: x.category.toLowerCase(),
      point: Number(x.point),
    }));

    // Create league data
    const createLeagueData = {
      name,
      organizer_id: userId,
      sport_id,
      join_privacy,
      statistics_info: processed_statistics_info,
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
    console.log("Error: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while creating the league.",
      500,
      false
    );
  }
};

// let CreateLeague = async (req, res) => {
//   try {
//     const { name, sport_id, join_privacy, statistics_info } = req.body;
//     const userId = req.params.userId;

//     // Validate name
//     if (!name) {
//       return apiResponse.onSuccess(res, "Name is required.", 400, false);
//     }

//     let fileName = "";
//     if (req.file && req.file.filename) {
//       fileName = "http://3.83.218.53/uploads/league/" + req.file.filename;
//     }

//     // Validate sport_id
//     if (!sport_id) {
//       return apiResponse.onSuccess(
//         res,
//         "Please provide a valid sport id.",
//         400,
//         false
//       );
//     }

//     let selected_sports = [];
//     if (sport_id && sport_id.length > 0) {
//       sport_id.forEach((x) => {
//         if (!mongoose.Types.ObjectId.isValid(x)) {
//           return apiResponse.onSuccess(
//             res,
//             "Please provide a valid sport id.",
//             400,
//             false
//           );
//         }
//       });

//       selected_sports = sport_id.map((x) => new mongoose.Types.ObjectId(x));
//     }

//     // Check if sport exists
//     const sport = await SportsModel.findById(sport_id);
//     if (!sport) {
//       return apiResponse.onSuccess(
//         res,
//         "Selected sport not found.",
//         400,
//         false
//       );
//     }

//     // Validate join_privacy
//     if (!join_privacy || ![1, 2].includes(Number(join_privacy))) {
//       return apiResponse.onSuccess(
//         res,
//         "Please provide valid join_privacy.",
//         400,
//         false
//       );
//     }

//     // Validate statistics_info
//     if (!statistics_info || statistics_info.length === 0) {
//       return apiResponse.onSuccess(
//         res,
//         "statistics_info is required.",
//         400,
//         false
//       );
//     }

//     let statistics_error = false;
//     if (statistics_info) {
//       statistics_info.forEach((x) => {
//         if (!x.category.trim() || !x.abbreviation.trim() || !x.point.trim()) {
//           statistics_error = true;
//         }
//         if (x.category) {
//           x.slug = x.category.toLowerCase();
//         }
//         if (x.point) {
//           x.point = Number(x.point);
//         }
//       });
//     }

//     if (statistics_error) {
//       return apiResponse.onSuccess(
//         res,
//         "Please provide valid statistics_info.",
//         400,
//         false
//       );
//     }

//     // Create league data
//     let createLeagueData = {
//       name: name,
//       organizer_id: userId, // Set this to the appropriate value
//       sport_id: selected_sports,
//       join_privacy: join_privacy,
//       statistics_info: statistics_info,
//       image: fileName,
//     };

//     await LeagueModel.create(createLeagueData);

//     return apiResponse.onSuccess(
//       res,
//       "League created successfully.",
//       200,
//       true
//     );
//   } catch (err) {
//     console.log("err ", err);
//     return apiResponse.onError(
//       res,
//       "An error occurred while creating the league.",
//       500,
//       false
//     );
//   }
// };

let LeagueDetail = async (req, res) => {
  try {
    const { league_id } = req.body;
    const today = new Date();

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

    let upcoming_events = await Event.find({
      league_id: new mongoose.Types.ObjectId(league_id),
      start_date: { $gte: today },
    })
      .sort({ created_at: -1 }) // Sort in descending order (newest first)
      .limit(3); // Populate the player_id field

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
      upcoming_events: upcoming_events,
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

let LeagueJoinRequest = async (req, res) => {
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

let LeaguePlayersList = async (req, res) => {
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

let LeagueUpcomingEvents = async (req, res) => {
  try {
    const { league_id } = req.body;
    const today = new Date();

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

    let upcoming_events = await Event.find({
      league_id: new mongoose.Types.ObjectId(league_id),
      start_date: { $gte: today },
    }).sort({ created_at: -1 });

    return apiResponse.onSuccess(
      res,
      "Events fetched successfully.",
      200,
      true,
      upcoming_events
    );
  } catch (error) {
    console.log("err ", error);
    return apiResponse.onError(
      res,
      "An error occurred while fetching events.",
      500,
      false
    );
  }
};

let LeaguePlayersListByRating = async (body, req, res) => {
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

    // Check if league exists
    let league = await LeagueModel.findById(league_id);
    if (!league) {
      return apiResponse.onSuccess(
        res,
        "Selected league not found.",
        400,
        false
      );
    }

    // Aggregate and sort players by sum of ratings
    let player_list = await LeaguePlayerModel.aggregate([
      {
        $match: {
          league_id: new mongoose.Types.ObjectId(league_id),
        },
      },
      {
        $unwind: {
          path: "$rating",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$player_id",
          total_rating: {
            $sum: {
              $cond: {
                if: { $isNumber: "$rating.rating" },
                then: "$rating.rating",
                else: { $toDouble: "$rating.rating" },
              },
            },
          },
          playerInfo: { $first: "$$ROOT" },
          ratings: { $push: "$rating" }, // Collect ratings into an array
        },
      },
      {
        $sort: { total_rating: -1 }, // Sort by total rating in descending order
      },
      {
        $lookup: {
          from: "users", // Assuming "users" is the name of your players collection
          localField: "_id",
          foreignField: "_id",
          as: "playerDetails",
        },
      },
      {
        $unwind: "$playerDetails",
      },
      {
        $project: {
          _id: 1,
          total_rating: 1,
          ratings: 1, // Include the ratings array
          "playerDetails._id": 1,
          "playerDetails.name": 1,
          "playerDetails.email": 1,
          "playerDetails.role": 1,
          "playerDetails.image": 1,
          "playerInfo.league_id": 1,
          "playerInfo.status": 1,
          "playerInfo.updatedAt": 1,
        },
      },
    ]);

    return apiResponse.onSuccess(
      res,
      "League players fetched successfully.",
      200,
      true,
      player_list
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching league players.",
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

    const league = await LeagueModel.findById(league_id);

    // Send notification on join league
    await sendFirebaseNotificationOnJoinReqest(league.name, 'Your requeste has been  '+genmessage+' for '+league.name+' league.', '', 'league_request_process', league._id, league, player_id)

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

let PlayerDetail = async (req, res) => {
  try {
    const { player_id } = req.body;

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

let JoinedList = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate player_id
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid user id.",
        400,
        false
      );
    }

    const leagues = await LeaguePlayerModel.aggregate([
      {
        $match: { player_id: new mongoose.Types.ObjectId(user_id), status: 2 }, // Match the player ID and status in the LeaguePlayer collection
      },
      {
        $lookup: {
          from: "leagues", // Lookup from the "leagues" collection
          localField: "league_id", // Local field in the LeaguePlayer collection
          foreignField: "_id", // Field in the leagues collection to match against
          as: "league", // Name of the array field to add to each matching document
        },
      },
      {
        $group: {
          _id: "$player_id", // Group by player_id
          player_id: { $first: "$player_id" }, // Preserve player_id
          leagues: { $push: "$league" }, // Merge multiple league arrays into a single array
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the final output
          player_id: 1,
          leagues: { $reduce: { input: "$leagues", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } } } // Flatten nested league arrays into a single array
        },
      }
    ]);

    return apiResponse.onSuccess(
      res,
      "League list by player id fetched successfully.",
      200,
      true,
      leagues[0] || []
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

module.exports = {
  getLeagueSportsList,
  CreateLeague,
  LeagueDetail,
  LeagueJoinRequest,
  LeaguePlayersList,
  LeagueUpcomingEvents,
  LeaguePlayersListByRating,
  ProcessRequest,
  PlayerDetail,
  JoinedList
};
