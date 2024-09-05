let notificationManager = require("../manager/notification");

let sendNotification = (req, res) => {
  return notificationManager.sendNotification(req, res);
};

let NotificationList = (req, res, next) => {
  return notificationManager.NotificationList(req.body, req, res);
};

module.exports = {
  NotificationList,
  sendNotification,
};
