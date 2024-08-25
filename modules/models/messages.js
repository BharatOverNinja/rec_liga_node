const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    message: {
      type: String,
      required: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "file", "string", "text"],
      default: "text",
    },
    received: {
      type: Boolean,
      default: true,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
