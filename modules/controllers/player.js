let playerManager = require("../manager/player");

let getUpcomingEvents = (req, res) => {
  return playerManager.getUpcomingEvents(req, res);
};

// let getAttendingEvents = (req, res) => {
//   return playerManager.getAttendingEvents(req, res);
// };

let getPastEvents = (req, res) => {
  return playerManager.getPastEvents(req, res);
};

let getTeammates = (req, res) => {
  return playerManager.getTeammates(req, res);
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

let joinLeague = (req, res) => {
  return playerManager.joinLeague(req, res);
};

let attendEvent = (req, res) => {
  return playerManager.attendEvent(req, res);
};

let rejectEventRequest = (req, res) => {
  return playerManager.rejectEventRequest(req, res);
};

let getLeaderboard = (req, res) => {
  return playerManager.getLeaderboard(req, res);
};

let ratePlayer = (req, res) => {
  return playerManager.ratePlayer(req, res);
};

let getPublicLeagues = (req, res) => {
  return playerManager.getPublicLeagues(req, res);
};

module.exports = {
  getUpcomingEvents,
  // getAttendingEvents,
  getPastEvents,
  getTeammates,
  getAllLeaguePlayers,
  getPlayerLeagues,
  getLeagueDetails,
  joinLeague,
  attendEvent,
  rejectEventRequest,
  getLeaderboard,
  ratePlayer,
  getPublicLeagues,
};
