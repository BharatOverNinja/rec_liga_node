const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    request_status: { type: Number } // 1: pending, 2: accepted, 3: Declined
  },
  { versionKey: false, collection: "captains", timestamps: true }
);

const exportModel = mongoose.model("captains", schemaDefinition);
module.exports = exportModel;
