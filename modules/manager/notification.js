"use strict";

let NotificationModel = require("../models/notification"),
  apiResponse = require("../helpers/apiResponse"),
  mongoose = require("mongoose"),
  { sendPushNotification } = require("../helpers/send_push_notification"),
  admin = require("../middleware/firebase_admin.js");

const MAX_RETRIES = 3;

// Function to send notification with a retry mechanism
async function sendNotification(req, res) {
  const { token, title, body, platform, data } = req.body; // Extract data from the request

  if (!token || !title || !body || !platform) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters." });
  }

  // Create a platform-specific payload
  const payload = createPayload(token, title, body, platform, data);

  // Send notification with retry mechanism
  try {
    const response = await sendWithRetry(payload, MAX_RETRIES);
    return res.status(200).json({ success: true, response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

// Helper function to create platform-specific payload
function createPayload(token, title, body, platform, data) {
  const basePayload = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    data: data || {},
  };

  // Add platform-specific options
  if (platform === "android") {
    basePayload.android = {
      priority: "high",
      notification: {
        sound: "default",
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
      },
    };
  } else if (platform === "ios") {
    basePayload.apns = {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    };
  } else if (platform === "web") {
    basePayload.webpush = {
      headers: {
        Urgency: "high",
      },
      notification: {
        icon: "/icon.png",
        click_action: "https://yourwebsite.com",
      },
    };
  }

  return basePayload;
}

// Helper function to send notifications with retry
async function sendWithRetry(payload, retriesLeft) {
  try {
    const response = await admin.messaging().send(payload);
    return response; // Return response if successful
  } catch (error) {
    if (retriesLeft <= 1) {
      throw new Error(
        "Failed to send notification after multiple attempts: " + error.message
      );
    }

    console.error(
      "Error sending notification. Retries left: " + (retriesLeft - 1),
      error.message
    );

    // Wait for a second before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return sendWithRetry(payload, retriesLeft - 1);
  }
}

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

let ClearNotification = async (body, req, res) => {
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

    //Delete all users notification
    await NotificationModel.deleteMany({user_id : user_id})

    return apiResponse.onSuccess(
      res,
      "Notification cleared successfully.",
      200,
      true
    );
  } catch (err) {
    console.log("err ", err);
  }
};

let ReadNotification = async (body, req, res) => {
  try {
    const { user_id } = req.params;
    const { notification_id } = body;

    // Validate event_id
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return apiResponse.onSuccess(
        res,
        "Please provide a valid user id.",
        400,
        false
      );
    }

    // Update read notification status by notification id
    await NotificationModel.updateOne({ _id: notification_id }, { read_status: true });

    return apiResponse.onSuccess(
      res,
      "Notification readed successfully.",
      200,
      true
    );
  } catch (err) {
    console.log("err ", err);
  }
};

let SendPush = async (body, req, res) => {
  try {
    const { title, message, device_token } = body;

    if(!title) {
      return apiResponse.onSuccess(
        res,
        "Title is require.",
        400,
        false
      );
    }

    if(!message) {
      return apiResponse.onSuccess(
        res,
        "Message is require.",
        400,
        false
      );
    }

    if(!device_token && device_token.length > 0) {
      return apiResponse.onSuccess(
        res,
        "Device token is require.",
        400,
        false
      );
    }

    await sendPushNotification(title, message, device_token)

    return apiResponse.onSuccess(
      res,
      "Notification sent successfully.",
      200,
      true
    );
  } catch (err) {
    console.log("err ", err);
  }
};

module.exports = {
  NotificationList,
  sendNotification,
  ClearNotification,
  ReadNotification,
  SendPush
};
