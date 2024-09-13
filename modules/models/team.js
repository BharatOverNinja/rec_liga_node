const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
    team_name: { type: String },
    captain_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    shirt_color: { type: String },
    turn: { type: Boolean}
  },
  { versionKey: false, collection: "teams", timestamps: true }
);

const exportModel = mongoose.model("teams", schemaDefinition);
module.exports = exportModel;
