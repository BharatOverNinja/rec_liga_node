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

let getPastEventsWhereResultHasUploaded = (req, res) => {
  return orgManager.getPastEventsWhereResultHasUploaded(req, res);
};

let getPastEventsWhereResultNotUploaded = (req, res) => {
  return orgManager.getPastEventsWhereResultNotUploaded(req, res);
};

let getEventDetails = (req, res) => {
  return orgManager.getEventDetails(req, res);
};

let organizerDraftTeam = (req, res) => {
  return orgManager.organizerDraftTeam(req, res);
};

let uploadEventResult = (req, res) => {
  return orgManager.uploadEventResult(req, res);
};

module.exports = {
  organizerDetails,
  getLeaguesAddedByOrganizer,
  getUpcomingEvents,
  getPastEventsWhereResultHasUploaded,
  getPastEventsWhereResultNotUploaded,
  getEventDetails,
  organizerDraftTeam,
  uploadEventResult,
};
