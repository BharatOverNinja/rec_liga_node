const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const UnreadMessagesSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },
  },
  { timestamps: true }
);

const UnreadMessage = mongoose.model("UnreadMessage", UnreadMessagesSchema);
module.exports = UnreadMessage;
