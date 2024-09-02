let orgManager = require("../manager/organizer");

let organizerDetails = (req, res) => {
  return orgManager.organizerDetails(req, res);
};

let getLeaguesAddedByOrganizer = (req, res) => {
  return orgManager.getLeaguesAddedByOrganizer(req, res);
};

let getUpcomingEvents = (req, res) => {
  return orgManager.getUpcomingEvents(req, res);
};

let getPastEvents = (req, res) => {
  return orgManager.getPastEvents(req, res);
};

let getEventDetails = (req, res) => {
  return orgManager.getEventDetails(req, res);
};

let getPastEventResults = (req, res) => {
  return orgManager.getPastEventResults(req, res);
};

let uploadEventResult = (req, res) => {
  return orgManager.uploadEventResult(req, res);
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
