let captainManager = require("../manager/captain");

let ChangeRequestStatus = (req, res, next) => {
  return captainManager
    .ChangeRequestStatus(req.body, req, res);
}

let AvailablePlayers = (req, res, next) => {
  return captainManager
    .AvailablePlayers(req.body, req, res);
}

module.exports = {
  ChangeRequestStatus: ChangeRequestStatus,
  AvailablePlayers: AvailablePlayers
};
