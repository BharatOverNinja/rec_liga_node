"use strict";

let User = require("../models/user"),
  apiResponse = require("../helpers/apiResponse"),
  League = require("../models/league"),
  Event = require("../models/event");

let organizerDetails = async (body, req, res) => {
  try {
    const { userId } = body;

    if (!userId) {
      return apiResponse.onSuccess(res, "User ID is required.", 400, false);
    }

    let user = User.findOne({ _id: userId });
    if (!user) {
      return apiResponse.onSuccess(res, "User not found.", 404, false);
    }

    return apiResponse.onSuccess(
      res,
      "Organizer details fetched successfully.",
      200,
      true,
      user
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching sports list.",
      500,
      false
    );
  }
};

let getLeaguesAddedByOrganizer = async (body, req, res) => {
  try {
    const { userId } = body;

    if (!userId) {
      return apiResponse.onSuccess(
        res,
        "User ID (organizer_id) is required.",
        400,
        false
      );
    }

    let leagues = await League.find({ organizer_id: userId });

    if (leagues.length === 0) {
      return apiResponse.onSuccess(
        res,
        "No leagues found for this organizer.",
        404,
        false
      );
    }

    return apiResponse.onSuccess(
      res,
      "Leagues added by organizer fetched successfully.",
      200,
      true,
      leagues
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching leagues.",
      500,
      false
    );
  }
};

let getUpcomingEvents = async (body, req, res) => {
  try {
    const { organizerId } = body;

    if (!organizerId) {
      return apiResponse.onSuccess(
        res,
        "Organizer ID is required.",
        400,
        false
      );
    }

    const today = new Date();

    let events = await Event.find({
      organizer_id: organizerId,
      date: { $gte: today },
    });

    if (events.length === 0)
      return apiResponse.onSuccess(
        res,
        "No upcoming events found.",
        404,
        false
      );

    return apiResponse.onSuccess(
      res,
      "Events fetched successfully.",
      200,
      true,
      events
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching events.",
      500,
      false
    );
  }
};

let getPastEvents = async (body, req, res) => {
  try {
    const { organizerId } = body;

    if (!organizerId) {
      return apiResponse.onSuccess(
        res,
        "Organizer ID is required.",
        400,
        false
      );
    }

    const today = new Date();

    let events = await Event.find({
      organizer_id: organizerId,
      date: { $lt: today },
    }).sort({ date: -1 });

    if (events.length === 0)
      return apiResponse.onSuccess(res, "No past events found.", 404, false);

    return apiResponse.onSuccess(
      res,
      "Events fetched successfully.",
      200,
      true,
      events
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching events.",
      500,
      false
    );
  }
};

let getEventDetails = async (body, req, res) => {
  try {
    const { eventId } = body;

    if (!eventId) {
      return apiResponse.onSuccess(res, "Event ID is required.", 400, false);
    }

    let event = await Event.findOne({ _id: eventId });

    if (!event) {
      return apiResponse.onSuccess(res, "Event not found.", 404, false);
    }

    return apiResponse.onSuccess(
      res,
      "Event details fetched successfully.",
      200,
      true,
      event
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching event details.",
      500,
      false
    );
  }
};

let getPastEventResults = async (req, res) => {
  try {
    const today = new Date();

    let events = await Event.find({
      end_date: { $lt: today },
      result: { $exists: true, $ne: "" },
    });

    return apiResponse.onSuccess(
      res,
      "Past event results fetched successfully.",
      200,
      true,
      events
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while fetching past event results.",
      500,
      false
    );
  }
};

let uploadEventResult = async (body, req, res) => {
  try {
    const { leagueId, eventId, ...updatedEventData } = body;

    if (!leagueId || !eventId) {
      return apiResponse.onSuccess(
        res,
        "League ID and Event ID are required.",
        400,
        false
      );
    }

    let updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, league_id: leagueId },
      updatedEventData,
      { new: true }
    );

    if (!updatedEvent) {
      return apiResponse.onSuccess(
        res,
        "Event not found or doesn't belong to the specified league.",
        404,
        false
      );
    }

    return apiResponse.onSuccess(
      res,
      "Event result uploaded successfully.",
      200,
      true,
      updatedEvent
    );
  } catch (err) {
    console.log("err ", err);
    return apiResponse.onError(
      res,
      "An error occurred while uploading the event result.",
      500,
      false
    );
  }
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
