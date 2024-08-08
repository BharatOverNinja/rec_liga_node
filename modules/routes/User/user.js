"use strict";

let express = require("express"),
  router = express.Router(),
  controller = require("../../controllers/User/auth"),
  helper = require("../../helpers/file_upload"),
  validateAccess = require('../../policies/Validate_request_access');

router.get("/sports_list", controller.SportsList);

module.exports = router;
