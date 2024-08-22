const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["Player", "League Organizer"] }, // league_organizer, player
    image: { type: String },
    date: { type: Date, default: Date.now },
  },
  { versionKey: false, collection: "users", timestamps: true }
);

const exportModel = mongoose.model("users", schemaDefinition);
module.exports = exportModel;
