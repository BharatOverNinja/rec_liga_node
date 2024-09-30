let leagueManager = require("../manager/league");

let getLeagueSportsList = (req, res) => {
  return leagueManager.getLeagueSportsList(req, res);
};

let CreateLeague = (req, res) => {
  return leagueManager.CreateLeague(req, res);
};

let LeagueDetail = (req, res) => {
  return leagueManager.LeagueDetail(req, res);
};

let LeagueJoinRequest = (req, res) => {
  return leagueManager.LeagueJoinRequest(req, res);
};

let LeaguePlayersList = (req, res) => {
  return leagueManager.LeaguePlayersList(req, res);
};

let LeagueUpcomingEvents = (req, res) => {
  return leagueManager.LeagueUpcomingEvents(req, res);
};

let LeaguePlayersListByRating = (req, res, next) => {
  return leagueManager.LeaguePlayersListByRating(req.body, req, res);
};
let ProcessRequest = (req, res, next) => {
  return leagueManager.ProcessRequest(req.body, req, res);
};

let PlayerDetail = (req, res) => {
  return leagueManager.PlayerDetail(req, res);
};

let JoinedList = (req, res) => {
  return leagueManager.JoinedList(req, res);
};

module.exports = {
  getLeagueSportsList,
  CreateLeague,
  LeagueDetail,
  LeagueJoinRequest,
  LeaguePlayersList,
  LeagueUpcomingEvents,
  LeaguePlayersListByRating,
  ProcessRequest,
  JoinedList,
  PlayerDetail,
};
