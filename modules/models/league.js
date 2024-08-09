const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    name: { type: String },
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: "sports" },
    organizer_id: { type: mongoose.Schema.Types.ObjectId },
    join_privacy : { type: Number }, // 1 : Public, 2 : Private
    statistics_info: { type: Array },
  },
  { versionKey: false, collection: "leagues", timestamps: true }
);

const exportModel = mongoose.model("leagues", schemaDefinition);
module.exports = exportModel;
