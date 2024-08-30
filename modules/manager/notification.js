"use strict";

let NotificationModel = require("../models/notification"),
  apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");
const admin = require("../middleware/firebase_admin.js");

let sendNotification = async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

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
  NotificationList,
  sendNotification,
};
