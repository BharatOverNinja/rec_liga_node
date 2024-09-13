let captainManager = require("../manager/captain");

let ChangeRequestStatus = (req, res) => {
  return captainManager.ChangeRequestStatus(req, res);
};

let AvailablePlayers = (req, res) => {
  return captainManager.AvailablePlayers(req, res);
};

module.exports = {
  ChangeRequestStatus: ChangeRequestStatus,
  AvailablePlayers: AvailablePlayers,
};
