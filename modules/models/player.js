const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    profile_image: {
      type: String,
      default: "../../uploads/user_images/no_dp_image.png",
    },

    nick_name: { type: String },

    date_of_birth: { type: Date },

    city: { type: String },

    rating: [
      {
        ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: "players" },
        rating: { type: Number },
      },
    ],

    sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "sports" }],

    rank: { type: String },

    points: { type: Number },

    wins: { type: Number },

    losses: { type: Number },

    ties: { type: Number },

    positions: [{ type: String }],

    event_requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],

    accepted_events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  },
  { versionKey: false, collection: "players", timestamps: true }
);

const exportModel = mongoose.model("Player", schemaDefinition);
module.exports = exportModel;
