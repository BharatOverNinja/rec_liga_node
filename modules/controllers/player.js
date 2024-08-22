let playerManager = require("../manager/player");

let updateUser = (req, res, next) => {
  return playerManager.updateUser(req.body, req, res);
};

let getUpcomingEvents = (req, res, next) => {
  return playerManager.getUpcomingEvents(req.params.playerId, req, res);
};

let getPlayerProfile = (req, res, next) => {
  return playerManager.getPlayerProfile(req.params.playerId, req, res);
};

let getPastEvents = (req, res, next) => {
  return playerManager.getPastEvents(req.params.playerId, req, res);
};

let rateTeammate = (req, res, next) => {
  return playerManager.rateTeammate(req.body, req, res);
}

let getAllLeaguePlayers = (req, res, next) => {
  return playerManager.getAllLeaguePlayers(req, res);
}

let getPlayerLeagues = (req, res, next) => {
  return playerManager.getPlayerLeagues(req.params.playerId, req, res);
}

let getLeagueDetails = (req, res, next) => {
  return playerManager.getLeagueDetails(req, res);
}

let acceptEventRequest = (req, res, next) => {
  return playerManager.acceptEventRequest(req.params.playerId, req, res);
}

let rejectEventRequest = (req, res, next) => {
  return playerManager.rejectEventRequest(req.params.playerId, req, res);
}

let getEventRequests = (req, res, next) => {
  return playerManager.getEventRequests(req.params.playerId, req, res);
}

let getLeaderBoard = (req, res, next) => {
  return playerManager.getLeaderBoard(req, res);
}

module.exports = {
  updateUser: updateUser,
  getUpcomingEvents: getUpcomingEvents,
  getPlayerProfile: getPlayerProfile,
  getPastEvents: getPastEvents,
  rateTeammate: rateTeammate,
  getAllLeaguePlayers: getAllLeaguePlayers,
  getPlayerLeagues: getPlayerLeagues,
  getLeagueDetails: getLeagueDetails,
  acceptEventRequest: acceptEventRequest,
  rejectEventRequest: rejectEventRequest,
  getEventRequests: getEventRequests,
  getLeaderBoard: getLeaderBoard,
};
