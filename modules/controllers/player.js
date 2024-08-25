let playerManager = require("../manager/player");

let getUpcomingEvents = (req, res) => {
  return playerManager.getUpcomingEvents(req, res);
};

let getAttendingEvents = (req, res) => {
  return playerManager.getAttendingEvents(req, res);
};

let getPastEvents = (req, res) => {
  return playerManager.getPastEvents(req, res);
};

let getAllLeaguePlayers = (req, res) => {
  return playerManager.getAllLeaguePlayers(req, res);
};

let getPlayerLeagues = (req, res) => {
  return playerManager.getPlayerLeagues(req, res);
};

let getLeagueDetails = (req, res) => {
  return playerManager.getLeagueDetails(req, res);
};

let acceptEventRequest = (req, res) => {
  return playerManager.acceptEventRequest(req, res);
};

let rejectEventRequest = (req, res) => {
  return playerManager.rejectEventRequest(req, res);
};

let getEventRequests = (req, res) => {
  return playerManager.getEventRequests(req, res);
};

let getLeaderBoard = (req, res) => {
  return playerManager.getLeaderBoard(req, res);
};

module.exports = {
  getUpcomingEvents: getUpcomingEvents,
  getAttendingEvents: getAttendingEvents,
  getPastEvents: getPastEvents,
  getAllLeaguePlayers: getAllLeaguePlayers,
  getPlayerLeagues: getPlayerLeagues,
  getLeagueDetails: getLeagueDetails,
  acceptEventRequest: acceptEventRequest,
  rejectEventRequest: rejectEventRequest,
  getEventRequests: getEventRequests,
  getLeaderBoard: getLeaderBoard,
};
