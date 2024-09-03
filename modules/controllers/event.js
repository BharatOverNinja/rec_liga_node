let eventManager = require("../manager/event");

let CreateEvent = (req, res) => {
  return eventManager.CreateEvent(req, res);
};

let SportsList = (req, res) => {
  return eventManager.SportsList(req, res);
};

let ChooseCaptain = (req, res) => {
  return eventManager.ChooseCaptain(req, res);
};

let CreateTeam = (req, res) => {
  return eventManager.CreateTeam(req, res);
};

let UpdateTeam = (req, res) => {
  return eventManager.UpdateTeam(req, res);
};

let GetTeam = (req, res) => {
  return eventManager.GetTeam(req, res);
};

module.exports = {
  CreateEvent: CreateEvent,
  SportsList: SportsList,
  ChooseCaptain: ChooseCaptain,
  CreateTeam: CreateTeam,
  UpdateTeam: UpdateTeam,
  GetTeam: GetTeam,
};
