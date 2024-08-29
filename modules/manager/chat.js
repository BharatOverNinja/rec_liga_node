"use strict";

let Chat = require("../models/chat"),
  User = require("../models/user"),
  apiResponse = require("../helpers/apiResponse");

let createGroupChat = async (req, res) => {
  try {
    const users = [req.body.user_id, ...members];
    let chat = new Chat({
      name: req.body.name,
      members: users,
      image: req.body.image,
      admin: req.body.user_id,
    });

    let data = await chat.save();

    return apiResponse.onSuccess(res, "Chat created", data);
  } catch (err) {
    return apiResponse.onError(res, err);
  }
};

let getUserActiveGroups = async (req, res) => {
  try {
    let groups = await Chat.find(
      { members: { $in: req.body.user_id } },
      { messages: { $slice: -1 } }
    ).populate(["members", "messages"]).lean();
    
    return apiResponse.onSuccess(res, "Groups", groups);
  } catch (err) {
    return apiResponse.onError(res, err);
  }
};

let deleteGroupChat = async (req, res) => {
  try {
    let group = await Chat.findOne({ _id: req.body.group_id });
    if (group) {
      group.remove();
      return apiResponse.onSuccess(res, "Group deleted");
    } else {
      return apiResponse.onError(res, "Group not found");
    }
  } catch (err) {
    return apiResponse.onError(res, err);
  }
};

module.exports = { createGroupChat, getUserActiveGroups, deleteGroupChat };
