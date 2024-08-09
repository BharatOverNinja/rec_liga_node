const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    name: { type: String },
    status: { type: Number }
  },
  { versionKey: false, collection: "sports", timestamps: true }
);

const exportModel = mongoose.model("sports", schemaDefinition);
module.exports = exportModel;
