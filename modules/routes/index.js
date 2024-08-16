let express = require("express"),
  router = express.Router(),
  userRoute = require("./user.js"),
  leagueRoute = require("./league.js"),
  captainRoute = require("./captain.js"),
  notificationsRoute = require("./notification.js"),
  eventRoute = require("./event.js");

router.use(`/user`, userRoute);
router.use(`/league`, leagueRoute);
router.use(`/event`, eventRoute);
router.use(`/captain`, captainRoute);
router.use(`/notifications`, notificationsRoute);

module.exports = router;
