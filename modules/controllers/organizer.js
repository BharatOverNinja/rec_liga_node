let orgManager = require("../manager/organizer");

let organizerDetails = (req, res, next) => {
  return orgManager.organizerDetails(req.body, req, res);
};

let getLeaguesAddedByOrganizer = (req, res) => {
  return orgManager.getLeaguesAddedByOrganizer( req, res);
};

let getUpcomingEvents = (req, res) => {
  return orgManager.getUpcomingEvents(req, res);
};

let getPastEvents = (req, res, next) => {
  return orgManager.getPastEvents(req.body, req, res);
};

let getEventDetails = (req, res, next) => {
  return orgManager.getEventDetails(req.body, req, res);
};

let getPastEventResults = (req, res, next) => {
  return orgManager.getPastEventResults(req.body, req, res);
};

let uploadEventResult = (req, res, next) => {
  return orgManager.uploadEventResult(req.body, req, res);
};

module.exports = {
  organizerDetails,
  getLeaguesAddedByOrganizer,
  getUpcomingEvents,
  getPastEvents,
  getEventDetails,
  getPastEventResults,
  uploadEventResult,
};
