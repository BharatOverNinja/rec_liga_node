let chatManager = require("../manager/chat");

let createGroupChat = (req, res) => {
  return chatManager.createGroupChat(req, res);
};

const getUserActiveGroups = async (req, res) => {
  const { userId } = req.params;

  return await chatManager.getUserActiveGroups({ userId }).then((data) => {
    if (data && data.errormessage) {
      return res.json({
        status: data.errormessage ? 400 : 200,
        error: data,
      });
    } else {
      return res.json({
        status: 200,
        data: data,
      });
    }
  });
};

let deleteGroupChat = (req, res) => {
  return chatManager.deleteGroupChat(req, res);
};

let deleteMessage = (req, res) => {
  return chatManager.deleteMessage(req, res);
};

let removeUserFromChat = (req, res) => {
  return chatManager.removeUserFromChat(req, res);
};

let joinChat = (req, res) => {
  return chatManager.joinChat(req, res);
};

module.exports = {
  createGroupChat,
  getUserActiveGroups,
  deleteGroupChat,
  deleteMessage,
  removeUserFromChat,
  joinChat
};
