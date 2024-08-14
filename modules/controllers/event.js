let eventManager = require("../manager/event");

let CreateEvent = (req, res, next) => {
  return eventManager
    .CreateEvent(req.body, req, res);
}

module.exports = {
  CreateEvent: CreateEvent
};
