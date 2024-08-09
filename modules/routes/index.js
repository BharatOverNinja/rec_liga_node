let express = require("express"),
  router = express.Router(),
  userRoute = require("./user.js"),
  leagueRoute = require("./league.js");

router.use(`/user`, userRoute);
router.use(`/league`, leagueRoute);

module.exports = router;
