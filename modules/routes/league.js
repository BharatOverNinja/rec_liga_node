"use strict";

let express = require("express"),
  router = express.Router(),
  multer = require('multer'),
  path = require('path'),
  controller = require("../controllers/league");

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/league/'); // specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
}).single('image'); // 'image' is the name of the field in the form


router.post("/create", upload, controller.CreateLeague);
router.get("/league_detail/:league_id", controller.LeagueDetail);
router.get("/join_request/:league_id", controller.LeagueJoinRequest);
router.get("/players/:league_id", controller.LeaguePlayersList);
router.post("/process_request", controller.ProcessRequest);
router.get("/player_detail/:player_id", controller.PlayerDetail);

module.exports = router;
