const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default : null },
    type: { type: String }, 
    detailed_id: { type: mongoose.Schema.Types.ObjectId, default : null },
    title: { type: String },
    message: { type: String },
    read_status: { type: Boolean }, // 1: Unread, 2, Readed, 
    sent_status: { type: Number }, // 1: pending, 2, sent, 3: Failed, 
    sent_date: { type: Date }
  },
  { versionKey: false, collection: "notifications", timestamps: true }
);

const exportModel = mongoose.model("notifications", schemaDefinition);
module.exports = exportModel;
