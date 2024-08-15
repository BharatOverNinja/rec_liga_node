const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    league_id: { type: mongoose.Schema.Types.ObjectId },
    player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status: { type: Number }, // 1: pending, 2: Accepted, 3: Rejected
  },
  { versionKey: false, collection: "league_players", timestamps: true }
);

const exportModel = mongoose.model("league_players", schemaDefinition);
module.exports = exportModel;
