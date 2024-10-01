let notificationManager = require("../manager/notification");

let sendNotification = (req, res) => {
  return notificationManager.sendNotification(req, res);
};

let NotificationList = (req, res, next) => {
  return notificationManager.NotificationList(req.body, req, res);
};

let ClearNotification = (req, res, next) => {
  return notificationManager.ClearNotification(req.body, req, res);
};

let ReadNotification = (req, res, next) => {
  return notificationManager.ReadNotification(req.body, req, res);
};

let SendPush = (req, res, next) => {
  return notificationManager.SendPush(req.body, req, res);
};

module.exports = {
  NotificationList,
  sendNotification,
  ClearNotification,
  ReadNotification,
  SendPush
};
