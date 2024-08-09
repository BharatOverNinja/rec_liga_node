let appConfig = process.appConfig.global_config,
  ObjectId = require("mongoose").Types.ObjectId,
  AccessDeniedError = require("../errors/accessDeniedError");

let validateRequest = (req, res, next) => {
  let hostname = req.hostname;
  let user_id = req.headers.user_id;
  let hospital_id = req.headers.hospital_id;
  let tokenId = req.get("X-AUTH-TOKEN");

  if (
    hostname != appConfig.request_origin ||
    !tokenId ||
    !user_id ||
    !hospital_id
  ) {
    throw new AccessDeniedError("Invalid request");
  }

  req.user = {
    user_id: ObjectId(user_id),
    hospital_id: ObjectId(hospital_id),
    token: tokenId,
    login_type: "hospital_user",
  };

  next();
};

module.exports = {
  validateRequest: validateRequest,
};
