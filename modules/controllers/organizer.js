let orgManager = require("../manager/organizer");

let organizerDetails = (req, res, next) => {
  return orgManager.organizerDetails(req.body, req, res);
};

let getLeaguesAddedByOrganizer = (req, res, next) => {
  return orgManager.getLeaguesAddedByOrganizer(req.body, req, res);
};

let getUpcomingEvents = (req, res, next) => {
  return orgManager.getUpcomingEvents(req.body, req, res);
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
  organizerDetails: organizerDetails,
  getLeaguesAddedByOrganizer: getLeaguesAddedByOrganizer,
  getUpcomingEvents: getUpcomingEvents,
  getPastEvents: getPastEvents,
  getEventDetails: getEventDetails,
  getPastEventResults: getPastEventResults,
  uploadEventResult: uploadEventResult,
};
