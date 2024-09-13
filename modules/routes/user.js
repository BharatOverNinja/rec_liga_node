"use strict";

let express = require("express"),
  router = express.Router(),
  multer = require("multer"),
  path = require("path"),
  controller = require("../controllers/user");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/user/");
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
}).single("profile_picture");

router.post("/store_registration_data", controller.storeRegistrationData);

router.post("/update_user/:userId", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err });
    }
    controller.updateUser(req, res);
  });
});

router.get(
  "/get_current_user_details/:email",
  controller.getCurrentUserDetails 
);

router.get("/sports_list", controller.SportsList);

router.delete("/delete_account/:userId", controller.deleteAccount);

module.exports = router;
