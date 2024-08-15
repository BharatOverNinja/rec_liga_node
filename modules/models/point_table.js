const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    win: { type: Number },
    loss: { type: Number },
    tie: { type: Number },
    captain_win: { type: Number },
    attend: { type: Number }
  },
  { versionKey: false, collection: "point_table", timestamps: true }
);

const exportModel = mongoose.model("point_table", schemaDefinition);
module.exports = exportModel;
