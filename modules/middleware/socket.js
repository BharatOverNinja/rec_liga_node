const User = require("../models/user.js");
const Chat = require("../models/chat.js");
const Message = require("../models/messages.js");
const UnreadMessages = require("../models/unread_messages.js");
const admin = require("./firebase_admin.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("user-login", async (uid) => {
      let user = await User.findById(uid);
      if (user) {
        user.socket_id = socket.id;
        user.save();
      }
    });

    socket.on("userlist", async (uid) => {
      let data = await User.find({ _id: { $ne: uid } });
      io.to(socket.id).emit("user-list", data);
    });

    socket.on("user-join-chat", async ({ chatId, userId }) => {
      socket.join(`chat-${chatId}`);
      const chat = await Chat.findOne(
        { _id: chatId },
        { messages: { $slice: -1 } }
      )
        .populate(["members", "messages"])
        .lean();
      if (chat) {
        let data = {
          _id: chat._id,
          name: chat.name,
          image: chat.image,
          messages: chat.messages,
          user: chat.members.find((user) => String(user._id) !== String(userId)),
          unreadMessages: chat.unreadMessages.length,
        };
        let user = chat.members.find(
          (user) => String(user._id) !== String(userId)
        );
        io.to(user.socket_id).emit("user-join-chat", data);
      }
    });

    socket.on("user-leave-chat", async ({ chatId }) => {
      socket.leave(`chat-${chatId}`);
    });

    socket.on("user-send-message", async (data) => {
      if (!data.assignedTo) {
        console.error("Invalid assignedTo:", data.assignedTo);
        return;
      }

      const newMessage = await Message.create({
        message: data.message,
        type: data.type ? data.type : "text",
        assignedTo: data.assignedTo,
        user: data.user_id,
      });

      const unreadMessages = await UnreadMessages.create({
        user: data.user_id,
        message: newMessage._id,
        to: data.assignedTo,
      });

      const chat = await Chat.findOne({ _id: data.assignedTo });
      chat.messages.push(newMessage);
      await chat.save();

      const chats = await Chat.findOne(
        { _id: data.assignedTo },
        { messages: { $slice: -1 } }
      ).populate(["members", "messages"]).lean();
      var notificationIds = "";

      const user = await User.findById({ _id: data.user_id });

      if (chats && chats.members && chats.members.length > 0) {
        chats.members.map((el) => {
          if (el._id != data.user_id) {
            notificationIds = el.token;
          }
        });
        var message = {data: {chatId: `${chat._id}`},
          notification: {
            title: user.name
              ? user.name
              : data.type == "text"
              ? data.message
              : data.type,
            body: data.type ? data.type : data.message,
          },
          token: notificationIds,
          android: {
            notification: {
              clickAction: "FLUTTER_NOTIFICATION_CLICK",
            },
          },
        };
        // admin.send(message, function (err, response) {
        //   if (err) {
        //     console.log("Something has gone wrong !", err);
        //   } else {
        //     console.log("Notification Done");
        //   }
        // });
      }
      io.in(`chat-${data.assignedTo}`).emit("receive-message", newMessage);
    });

    socket.on("user-unread-count", async (data) => {
      const chats = await UnreadMessages.find({ to: data.assignedTo });
      if (chats.length > 0) {
        let object = {
          data: chats.length,
          chat: data.assignedTo,
        };
        socket.broadcast.emit("receive-message-list", object);
      }
    });

    socket.on("chat-message-list", async (data) => {
      const chat_id = data.id;
      if (!chat_id) {
        console.error("Invalid chat_id:", chat_id);
        return;
      }

      const last_message = data.last_message || "";
      let chat = [];

      !last_message
        ? (chat = await Message.find({ assignedTo: chat_id })
            .sort({ _id: -1 })
            .limit(50))
        : (chat = await Message.find({
            _id: { $lt: last_message },
            assignedTo: chat_id,
          })
            .sort({ _id: -1 })
            .limit(50));

      io.sockets.in(`chat-${chat_id}`).emit("message-list", chat);
    });

    socket.on("user-typing-message", async (data) => {
      io.to(`chat-${data.cid}`).emit("user-typing", data);
    });

    socket.on("viewUnreadMessages", async ({ chat, user }) => {
      await UnreadMessages.deleteMany({ to: chat, user: { $nin: user } });
      await Message.updateMany(
        { viewed: false, user: { $nin: user }, to: chat },
        { $set: { viewed: true } }
      );
      io.to(user).emit("receiveReadMessages", { chat, user });
    });
  });
};
