const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    league_id: { type: mongoose.Schema.Types.ObjectId, ref: 'leagues' },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    selection_status: { type: Number }, // 1: pending, 2: accepted
    is_captain: { type: Boolean },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'teams' },
    is_attended: { type: Boolean },
    start_date: { type: Date },
    end_date: { type: Date }
  },
  { versionKey: false, collection: "attend_event", timestamps: true }
);

const exportModel = mongoose.model("attend_event", schemaDefinition);
module.exports = exportModel;
