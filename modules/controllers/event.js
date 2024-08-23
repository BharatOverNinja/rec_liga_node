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

module.exports = {
  CreateEvent: CreateEvent,
  SportsList: SportsList,
  ChooseCaptain: ChooseCaptain
};
