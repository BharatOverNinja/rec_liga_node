"use strict";

let Chat = require("../models/chat"),
  User = require("../models/user"),
  UnreadMessages = require("../models/unread_messages"),
  Message = require("../models/messages"),
  apiResponse = require("../helpers/apiResponse");

let createGroupChat = async (req, res) => {
  try {
    const serverUrl = "http://3.83.218.53/uploads/user/";

    let chat = new Chat({
      name: req.body.name,
      members: req.params.userId,
      image: req.file ? serverUrl + req.file.filename : undefined,
      admin: req.params.userId,
    });

    let data = await chat.save();

    return apiResponse.onSuccess(
      res,
      "Chat created successfully",
      200,
      true,
      data
    );
  } catch (err) {
    console.error("Error creating group chat:", err); // Log the error for debugging
    return apiResponse.onError(res, err);
  }
};

// const getUserActiveGroups = async ({ userId }) => {
//   try {
//     const chats = await Chat.find({ messages: { $slice: -1 } }).populate([
//       {
//         path: "members",
//         select: "_id full_name profile_picture ",
//       },
//       "messages",
//     ]);

//     const formattedChats = await Promise.all(
//       chats.map(async (chat) => {
//         const unreadMessages = await UnreadMessages.countDocuments({
//           to: chat._id,
//           user: { $nin: userId },
//         });

//         return {
//           _id: chat._id,
//           name: chat.name,
//           image: chat.image,
//           messages: chat.messages,
//           admins: chat.admin,
//           users: chat.members,
//           unreadMessages,
//         };
//       })
//     );

//     return formattedChats;
//   } catch (error) {
//     return { errormessage: error.message };
//   }
// };

const getUserActiveGroups = async ({ userId }) => {
  try {
    const chats = await Chat.find({ members: userId }).populate([
      {
        path: "members",
        select: "_id full_name profile_picture",
      },
      {
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 },
      },
    ]);

    // Format the retrieved groups
    const formattedChats = await Promise.all(
      chats.map(async (chat) => {
        const unreadMessages = await UnreadMessages.countDocuments({
          chat: chat._id,
          // user: userId,
          // read: false,
        });

        return {
          _id: chat._id,
          name: chat.name,
          image: chat.image,
          messages: chat.messages,
          admins: chat.admin,
          users: chat.members,
          unreadMessages,
        };
      })
    );

    return formattedChats;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user groups");
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

const deleteMessage = async ({ req, res }) => {
  try {
    const { chatId } = req.body.chatId;
    const { messageId } = req.body.messageId;

    // Find the chat document by ID
    const chat = await Chat.findById(chatId);

    // Check if the chat exists
    if (!chat) {
      return {
        errormessage: "Chat not found",
      };
    }

    // Remove the message ID from the chat's messages array
    const messageIndex = chat.messages.indexOf(messageId);
    if (messageIndex === -1) {
      return {
        errormessage: "Message not found in chat",
      };
    }

    chat.messages.splice(messageIndex, 1);

    // Save the updated chat document
    await chat.save();

    // Delete the message document from the Message collection
    await Message.deleteOne({ _id: messageId });

    // Return success response
    return {
      success: true,
      data: {
        chat,
        deletedMessageId: messageId,
      },
    };
  } catch (error) {
    // Return error response
    return {
      errormessage: error.message,
    };
  }
};

const removeUserFromChat = async ({ req, res }) => {
  try {
    const { chatId } = req.body.chatId;
    const { userId } = req.body.userId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return {
        errormessage: "chat not found",
      };
    }

    // Find the index of the user to remove
    const findIndex = chat.users.indexOf(userId);

    // Check if the user exists in the array
    if (findIndex !== -1) {
      // Remove the user from the array
      chat.users.splice(findIndex, 1);

      await chat.save();

      return {
        success: true,
        data: chat,
      };
    } else {
      return {
        errormessage: "User not found in the chat",
      };
    }
  } catch (error) {
    return {
      errormessage: error.message,
    };
  }
};

const joinChat = async ({ req, res }) => {
  try {
    const { chatId } = req.body.chatId;
    const userId = req.params.userId;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return { message: "chat not found!" };
    }

    if (chat.users.includes(userId)) {
      return {
        message: "User is already a participant!",
      };
    }

    chat.users.push(userId);
    await chat.save();

    return { message: "Successfully joined Chat." };
  } catch (error) {
    return {
      errormessage: error.message,
    };
  }
};

module.exports = {
  createGroupChat,
  getUserActiveGroups,
  deleteGroupChat,
  deleteMessage,
  removeUserFromChat,
  joinChat,
};
