let eventManager = require("../manager/event");

let CreateEvent = (req, res, next) => {
  return eventManager
    .CreateEvent(req.body, req, res);
}

let SportsList = (req, res, next) => {
  return eventManager
    .SportsList(req.body, req, res);
}

let ChooseCaptain = (req, res, next) => {
  return eventManager
    .ChooseCaptain(req.body, req, res);
}

let CreateTeam = (req, res, next) => {
  return eventManager
    .CreateTeam(req.body, req, res);
}

let UpdateTeam = (req, res, next) => {
  return eventManager
    .UpdateTeam(req.body, req, res);
}

let GetTeam = (req, res, next) => {
  return eventManager
    .GetTeam(req.body, req, res);
}

module.exports = {
  CreateEvent: CreateEvent,
  SportsList: SportsList,
  ChooseCaptain: ChooseCaptain,
  CreateTeam: CreateTeam,
  UpdateTeam: UpdateTeam,
  GetTeam: GetTeam
};
