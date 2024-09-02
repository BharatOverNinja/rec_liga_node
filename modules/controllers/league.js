let leagueManager = require("../manager/league");

let getLeagueSportsList = (req, res) => {
  return leagueManager.getLeagueSportsList(req, res);
};

let CreateLeague = (req, res) => {
  return leagueManager.CreateLeague(req, res);
};

let LeagueDetail = (req, res, next) => {
  return leagueManager.LeagueDetail(req.body, req, res);
};

let LeagueJoinRequest = (req, res) => {
  return leagueManager.LeagueJoinRequest(req, res);
};

let LeaguePlayersList = (req, res, next) => {
  return leagueManager.LeaguePlayersList(req.body, req, res);
};

let LeaguePlayersListByRating = (req, res, next) => {
  return leagueManager.LeaguePlayersListByRating(req.body, req, res);
};
let ProcessRequest = (req, res, next) => {
  return leagueManager.ProcessRequest(req.body, req, res);
};

let PlayerDetail = (req, res, next) => {
  return leagueManager.PlayerDetail(req.body, req, res);
};

module.exports = {
  getLeagueSportsList,
  CreateLeague,
  LeagueDetail,
  LeagueJoinRequest,
  LeaguePlayersList,
  LeaguePlayersListByRating,
  ProcessRequest,
  PlayerDetail,
};
