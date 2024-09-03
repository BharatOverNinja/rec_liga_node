"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/league");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/league/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

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
}).single("image");

router.post("/create/:userId", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err });
    }
    controller.CreateLeague(req, res);
  });
});

module.exports = router;

router.get("/get_league_sports_list", controller.getLeagueSportsList);

router.get("/league_detail", controller.LeagueDetail); //done

router.get("/join_requests", controller.LeagueJoinRequest); //done

router.get("/players", controller.LeaguePlayersList); //done

router.get("/upcoming_events", controller.LeagueUpcomingEvents); //done

router.post("/process_request", controller.ProcessRequest); //done

router.get("/player_detail", controller.PlayerDetail); //done

router.get(
  "/players_by_rating/:league_id",
  controller.LeaguePlayersListByRating
);

module.exports = router;
