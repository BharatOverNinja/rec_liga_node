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

const fileFilter = function (req, file, cb) {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Only images (jpeg, jpg, png) are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("profile_picture");

router.post("/store_registration_data", controller.storeRegistrationData); //done

router.post("/update_user/:userId", (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // Handle Multer error (e.g., invalid file type)
      return res.status(400).send({ error: err.message });
    }
    console.log(req.body); // Check if req.body is being populated
    controller.updateUser(req, res);
  });
}); //done

router.get(
  "/get_current_user_details/:email",
  controller.getCurrentUserDetails 
); //done

router.get("/sports_list", controller.SportsList);

router.delete("/delete_account/:userId", controller.deleteAccount); //done

module.exports = router;
