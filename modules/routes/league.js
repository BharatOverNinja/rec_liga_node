"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/league");

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/league/"); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer to handle file uploads
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

    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);

    controller.CreateLeague(req, res);
  });
}); //done

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
