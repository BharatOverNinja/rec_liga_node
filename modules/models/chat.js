const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    name: { type: String },

    image: { type: String },

    members: [{ type: Schema.Types.ObjectId, ref: "users" }],

    admin: { type: Schema.Types.ObjectId, ref: "users" },

    unreadMessages: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
  },
  { versionKey: false, collection: "chats", timestamps: true }
);

const exportModel = mongoose.model("Chat", schemaDefinition);
module.exports = exportModel;
