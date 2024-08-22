"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../controllers/user");

router.post("/store_registration_data", controller.storeRegistrationData);
router.post("/get_current_user_details/:email", controller.getCurrentUserDetails);
router.get("/sports_list", controller.SportsList);

module.exports = router;
