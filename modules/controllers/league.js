let leagueManager = require("../manager/league");

let CreateLeague = (req, res, next) => {
  return leagueManager
    .CreateLeague(req.body, req, res);
}
let LeagueDetail = (req, res, next) => {
  return leagueManager
    .LeagueDetail(req.body, req, res);
}
let LeagueJoinRequest = (req, res, next) => {
  return leagueManager
    .LeagueJoinRequest(req.body, req, res);
}
let LeaguePlayersList = (req, res, next) => {
  return leagueManager
    .LeaguePlayersList(req.body, req, res);
}
let ProcessRequest = (req, res, next) => {
  return leagueManager
    .ProcessRequest(req.body, req, res);
}
let PlayerDetail = (req, res, next) => {
  return leagueManager
    .PlayerDetail(req.body, req, res);
}
module.exports = {
  CreateLeague: CreateLeague,
  LeagueDetail: LeagueDetail,
  LeagueJoinRequest: LeagueJoinRequest,
  LeaguePlayersList: LeaguePlayersList,
  ProcessRequest: ProcessRequest,
  PlayerDetail: PlayerDetail
};
