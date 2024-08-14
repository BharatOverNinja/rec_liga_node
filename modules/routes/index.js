let express = require("express"),
  router = express.Router(),
  userRoute = require("./user.js"),
  leagueRoute = require("./league.js"),
  eventRoute = require("./event.js");

router.use(`/user`, userRoute);
router.use(`/league`, leagueRoute);
router.use(`/event`, eventRoute);

module.exports = router;
