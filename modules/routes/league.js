"use strict";

let express = require("express"),
  router = express.Router(),
  multer = require("multer"),
  path = require("path"),
  controller = require("../controllers/league");

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/league/"); // specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
}).single("image"); // 'image' is the name of the field in the form

router.post("/create/:userId", upload, controller.CreateLeague); //done

router.get("/league_detail/:league_id", controller.LeagueDetail); //done

router.get("/join_requests/:league_id", controller.LeagueJoinRequest); //done

router.get("/players/:league_id", controller.LeaguePlayersList); //done

router.post("/process_request", controller.ProcessRequest); //done

router.get("/player_detail/:player_id", controller.PlayerDetail); //done

router.get("/players_by_rating/:league_id", controller.LeaguePlayersListByRating);

module.exports = router;
