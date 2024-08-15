const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    name: { type: String },
    email: { type: String },
    role: { type: String }, // league_organizer, player
    image: { type: String }
  },
  { versionKey: false, collection: "users", timestamps: true }
);

const exportModel = mongoose.model("users", schemaDefinition);
module.exports = exportModel;
