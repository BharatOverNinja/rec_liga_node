const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    organizer_id: { type: mongoose.Schema.Types.ObjectId },
    league_id: { type: mongoose.Schema.Types.ObjectId, ref: "leagues" },
    title: { type: String },
    date: { type: Date },
    location : { type: String },
    playes_count: { type: Number },
    start_date: { type: Date },
    end_date: { type: Date },
    repeat_event: { type: String }, // every_day, one_time
    rvsp_deadline: { type: Date },
  },
  { versionKey: false, collection: "events", timestamps: true }
);

const exportModel = mongoose.model("events", schemaDefinition);
module.exports = exportModel;
