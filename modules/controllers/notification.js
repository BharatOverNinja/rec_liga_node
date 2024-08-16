let notificationManager = require("../manager/notification");

let NotificationList = (req, res, next) => {
  return notificationManager
    .NotificationList(req.body, req, res);
}

module.exports = {
  NotificationList : NotificationList
};
