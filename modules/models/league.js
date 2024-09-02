const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    name: { type: String },
    location: { type: String },
    date: { type: Date },
    sport_id: { type: Array },
    organizer_id: { type: mongoose.Schema.Types.ObjectId },
    join_privacy: { type: Number },
    statistics_info: { type: Array },
    image: { type: String, default: null },
  },
  { versionKey: false, collection: "leagues", timestamps: true }
);

const exportModel = mongoose.model("leagues", schemaDefinition);
module.exports = exportModel;
