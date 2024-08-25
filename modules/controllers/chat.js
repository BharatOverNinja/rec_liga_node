let chatManager = require("../manager/chat");

let createGroupChat = (req, res, next) => {
  return chatManager.createGroupChat(req.body, req, res);
};

let getUserActiveGroups = (req, res, next) => {
  return chatManager.getUserActiveGroups(req.body, req, res);
};

let deleteGroupChat = (req, res, next) => {
  return chatManager.deleteGroupChat(req.body, req, res);
};

module.exports = {
  createGroupChat,
  getUserActiveGroups,
  deleteGroupChat,
};
