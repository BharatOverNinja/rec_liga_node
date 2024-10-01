let UserModel = require("../models/user");
let NotificationModel = require("../models/notification");

const sendFirebaseNotification = async (
  title,
  notification,
  image_path = "",
  type,
  detailed_id,
  obj_detail
) => {
  const { messaging } = require("../../app");

  let activeUsersList = await UserModel.find({
    device_token: { $ne: null },
    device_type: { $ne: null },
  }).lean();

  activeUsersList = activeUsersList || [];

  let device_tokens = activeUsersList
    ?.map((user) => user?.device_token)
    ?.filter(
      (device_token) =>
        device_token !== null &&
        device_token !== undefined &&
        device_token !== ""
    );

  let uniqueDeviceTokens = new Set(device_tokens);

  let uniqueDeviceTokensArray = Array.from(uniqueDeviceTokens);
  console.log("uniqueDeviceTokensArray ", uniqueDeviceTokensArray);

  if (uniqueDeviceTokensArray?.length > 0) {
    let message = {
      tokens: uniqueDeviceTokensArray,
      notification: {
        title: notification,
        body: title,
      },
      data: {
        detailed_id: detailed_id ? JSON.stringify(detailed_id) : "",
        detail: obj_detail ? JSON.stringify(obj_detail) : "",
        type: type,
      },
    };

    // if(type) {
    //   message.notification.body = message.notification.title,
    //   message.notification.title = ''
    // } else {
    //   delete message.data
    // }

    if (image_path) {
      message.notification.image = image_path;
    }

    let sent_users = await UserModel.find({
      device_token: { $in: uniqueDeviceTokensArray },
    }).lean();

    for (let user of sent_users) {
      await NotificationModel.create({
        user_id: user._id,
        type: type,
        detailed_id: detailed_id,
        title: notification,
        message: title,
        read_status: false,
        sent_status: 1,
        sent_date: new Date(),
      });
    }

    messaging
      .sendEachForMulticast(message)
      .then((response) => {
        // Response is an object with results for each token
        response.responses.forEach((result, index) => {
          if (result.error) {
            console.error(
              `Failed to send notification to token ${message.tokens[index]}:`,
              result.error
            );
          } else {
            console.log(
              `Successfully sent notification to token ${message.tokens[index]}`
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  }
};

const sendFirebaseNotificationOnJoinReqest = async (
  title,
  notification,
  image_path = "",
  type,
  detailed_id,
  obj_detail,
  user_id = null
) => {
  const { messaging } = require("../../app");

  let activeUsersList = await UserModel.find({
    _id: type == "league_request_process" ? user_id : obj_detail.organizer_id,
    device_token: { $ne: null },
    device_type: { $ne: null },
  }).lean();

  activeUsersList = activeUsersList || [];
  let device_tokens = activeUsersList
    ?.map((user) => user?.device_token)
    ?.filter(
      (device_token) =>
        device_token !== null &&
        device_token !== undefined &&
        device_token !== ""
    );

  let uniqueDeviceTokens = new Set(device_tokens);

  let uniqueDeviceTokensArray = Array.from(uniqueDeviceTokens);
  console.log("uniqueDeviceTokensArray ", uniqueDeviceTokensArray);

  if (uniqueDeviceTokensArray?.length > 0) {
    let message = {
      tokens: uniqueDeviceTokensArray,
      notification: {
        title: notification,
        body: title,
      },
      data: {
        detailed_id: detailed_id ? JSON.stringify(detailed_id) : "",
        detail: obj_detail ? JSON.stringify(obj_detail) : "",
        type: type,
      },
    };

    if (image_path) {
      message.notification.image = image_path;
    }

    let sent_users = await UserModel.find({
      _id: type == "league_request_process" ? user_id : obj_detail.organizer_id,
      device_token: { $in: uniqueDeviceTokensArray },
    }).lean();

    for (let user of sent_users) {
      await NotificationModel.create({
        user_id: user._id,
        type: type,
        detailed_id: detailed_id,
        title: notification,
        message: title,
        read_status: false,
        sent_status: 1,
        sent_date: new Date(),
      });
    }

    messaging
      .sendEachForMulticast(message)
      .then((response) => {
        // Response is an object with results for each token
        response.responses.forEach((result, index) => {
          if (result.error) {
            console.error(
              `Failed to send notification to token ${message.tokens[index]}:`,
              result.error
            );
          } else {
            console.log(
              `Successfully sent notification to token ${message.tokens[index]}`
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  }
};

const sendFirebaseNotificationOnJoinTeam = async (
  title,
  notification,
  image_path = "",
  type,
  detailed_id,
  obj_detail,
  user_id = null
) => {
  const { messaging } = require("../../app");

  let activeUsersList = await UserModel.find({
    _id: detailed_id,
    device_token: { $ne: null },
    device_type: { $ne: null },
  }).lean();

  activeUsersList = activeUsersList || [];
  let device_tokens = activeUsersList
    ?.map((user) => user?.device_token)
    ?.filter(
      (device_token) =>
        device_token !== null &&
        device_token !== undefined &&
        device_token !== ""
    );

  let uniqueDeviceTokens = new Set(device_tokens);

  let uniqueDeviceTokensArray = Array.from(uniqueDeviceTokens);
  console.log("uniqueDeviceTokensArray ", uniqueDeviceTokensArray);

  if (uniqueDeviceTokensArray?.length > 0) {
    let message = {
      tokens: uniqueDeviceTokensArray,
      notification: {
        title: notification,
        body: title,
      },
      data: {
        detailed_id: detailed_id ? JSON.stringify(detailed_id) : "",
        detail: obj_detail ? JSON.stringify(obj_detail) : "",
        type: type,
      },
    };

    if (image_path) {
      message.notification.image = image_path;
    }

    let sent_users = await UserModel.find({
      _id: detailed_id,
      device_token: { $in: uniqueDeviceTokensArray },
    }).lean();

    for (let user of sent_users) {
      await NotificationModel.create({
        user_id: user._id,
        type: type,
        detailed_id: detailed_id,
        title: notification,
        message: title,
        read_status: false,
        sent_status: 1,
        sent_date: new Date(),
      });
    }

    messaging
      .sendEachForMulticast(message)
      .then((response) => {
        // Response is an object with results for each token
        response.responses.forEach((result, index) => {
          if (result.error) {
            console.error(
              `Failed to send notification to token ${message.tokens[index]}:`,
              result.error
            );
          } else {
            console.log(
              `Successfully sent notification to token ${message.tokens[index]}`
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  }
};

const sendPushNotification = async ( title, message, device_token ) => {
  const { messaging } = require("../../app");

  let device_tokens = device_token?.filter(
      (device_token) =>
        device_token !== null &&
        device_token !== undefined &&
        device_token !== ""
    );

  let uniqueDeviceTokens = new Set(device_tokens);

  let uniqueDeviceTokensArray = Array.from(uniqueDeviceTokens);

  if (uniqueDeviceTokensArray?.length > 0) {
    let messageObj = {
      tokens: uniqueDeviceTokensArray,
      notification: {
        title: title,
        body: message,
      }
    };

    messaging
      .sendEachForMulticast(messageObj)
      .then((response) => {
        // Response is an object with results for each token
        response.responses.forEach((result, index) => {
          if (result.error) {
            console.error(
              `Failed to send notification`,
              result.error
            );
          } else {
            console.log(
              `Successfully sent notification`
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  }
};

module.exports = {
  sendFirebaseNotification,
  sendFirebaseNotificationOnJoinReqest,
  sendFirebaseNotificationOnJoinTeam,
  sendPushNotification
};
