let notificationManager = require("../manager/notification");

let SendNotification = (req, res) => {
  return notificationManager.SendNotification(req, res);
};

let NotificationList = (req, res, next) => {
  return notificationManager.NotificationList(req.body, req, res);
};

module.exports = {
  NotificationList,
  SendNotification,
};
