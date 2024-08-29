"use strict";

let NotificationModel = require("../models/notification"),
  apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");

let NotificationList = async (body, req, res) => {
  try {
    const { user_id } = req.params;

    // Validate event_id
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid user id.",
        400,
        false
      );
    }

    let notification_list = await NotificationModel.find({
      user_id: new mongoose.Types.ObjectId(user_id),
    }).populate("user_id");

    return apiResponse.onSuccess(
      res,
      "Notification list fetched successfully.",
      200,
      true,
      notification_list
    );
  } catch (err) {
    console.log("err ", err);
  }
};

module.exports = {
  NotificationList: NotificationList,
};
