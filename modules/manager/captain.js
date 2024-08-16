"use strict";

let EventModel = require("../models/event"),
  EventAttandanceModel = require("../models/attend_event"),
  CaptainModel = require("../models/captain"),
  apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

let ChangeRequestStatus = async (body,req, res) => {
    try {
      const { event_id, user_id, request_status } = body;

      // Validate event_id
      if (!event_id || !mongoose.Types.ObjectId.isValid(event_id)) {
        return apiResponse.onSuccess(res, "Please provide a valid event id.", 400, false);
      }

      // Check if event exists
      const event = await EventModel.findById(event_id);
      if (!event) {
        return apiResponse.onSuccess(res, "Selected event not found.", 400, false);
      }

      if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
        return apiResponse.onSuccess(res, "Please provide a valid user id.", 400, false);
      }

      // Validate name
      if (!request_status || request_status && ![2,3].includes(Number(request_status))) {
        return apiResponse.onSuccess(res, "Please select valid request_status value.", 400, false);
      }

      const captain = await CaptainModel.findOne({event_id : new mongoose.Types.ObjectId(event_id), user_id: new mongoose.Types.ObjectId(user_id)});
      // If captain exist for same event then update status or else create new captain
      if(captain) {
        captain.request_status = request_status
        await captain.save();
      } else {
        let create_captain = {
          event_id: new mongoose.Types.ObjectId(event_id),
          user_id: new mongoose.Types.ObjectId(user_id),
          request_status : Number(request_status)
        }
        await CaptainModel.create(create_captain);
      }

      let result = "";
      if(Number(request_status) == 2) {
        result = " accepted "
      } else {
        result = " declined "
      }
      return apiResponse.onSuccess(
        res,
        "Captainship"+result+"successfull.",
        200,
        true
      );
    }catch(err) {
      console.log("err ", err)
    }
}

let AvailablePlayers = async (body,req, res) => {
  try {
    const { event_id } = req.params;

    // Validate event_id
    if (!event_id || !mongoose.Types.ObjectId.isValid(event_id)) {
      return apiResponse.onSuccess(res, "Please provide a valid event id.", 400, false);
    }

    // Step 1: Fetch the event details using event_id
    // Check if event exists
    const event = await EventModel.findById(event_id);
    if (!event) {
      return apiResponse.onSuccess(res, "Selected event not found.", 400, false);
    }

    // Step 2: Get all users who have been selected for the event
    const selected_users = await EventAttandanceModel.find({
      event_id: event_id,
    }).populate('user_id');

    // Step 3: Filter out users who have other events on the same day
    const filtered_users = await Promise.all(selected_users.map(async (record) => {

      // Remove those players who is selected for other events
      const conflicting_events = await EventAttandanceModel.find({
        user_id: record.user_id._id,
        selection_status : 2,
        event_id: { $ne: event_id },
        start_date: { $lt: event.end_date, $gte: event.start_date },
        end_date: { $gt: event.start_date, $lte: event.end_date }
      });

      // If no conflicting events, keep the user in the list
      if (conflicting_events.length === 0) {
        return record;
      }
      return null;
    }));

    // Remove null values from the array
    const final_filtered_users = filtered_users.filter(user => user !== null);

    return apiResponse.onSuccess(
      res,
      "Available players list fetched.",
      200,
      true,
      final_filtered_users
    );
  }catch(err) {
    console.log("err ", err)
  }
}
module.exports = {
  ChangeRequestStatus: ChangeRequestStatus,
  AvailablePlayers: AvailablePlayers
};
