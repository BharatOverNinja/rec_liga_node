const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    organizer_id: { type: mongoose.Schema.Types.ObjectId },
    league_id: { type: mongoose.Schema.Types.ObjectId, ref: "leagues" },
    title: { type: String },
    date: { type: Date },
    location: { type: String },
    total_teams: { type: Number },
    players_count: { type: Number },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    start_date: { type: Date },
    end_date: { type: Date },
    repeat_event: { type: String },
    rsvp_deadline: { type: Date },
    result: { type: String },
    team_a_score: { type: String },
    team_b_score: { type: String },
  },
  { versionKey: false, collection: "events", timestamps: true }
);

const exportModel = mongoose.model("events", schemaDefinition);
module.exports = exportModel;
