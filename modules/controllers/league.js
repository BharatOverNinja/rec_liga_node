let leagueManager = require("../manager/league");

let CreateLeague = (req, res, next) => {
  return leagueManager
    .CreateLeague(req.body, req, res);
}

module.exports = {
  CreateLeague: CreateLeague
};
