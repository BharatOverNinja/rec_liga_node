const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const statisticsInfoSchema = new Schema({
  category: { type: String, required: true },
  abbreviation: { type: String, required: true },
  point: { type: Number, required: true },
  slug: { type: String },
});

const leagueSchema = new Schema(
  {
    name: { type: String, required: true },

    location: { type: String },

    date: { type: Date },

    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],

    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],

    sport_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sports",
      required: true,
    },

    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    join_privacy: { type: Number, required: true },

    statistics_info: [statisticsInfoSchema],

    image: { type: String, default: null },
  },
  { versionKey: false, collection: "leagues", timestamps: true }
);

const LeagueModel = mongoose.model("leagues", leagueSchema);
module.exports = LeagueModel;

// const mongoose = require("../helpers/mongoose");
// const Schema = mongoose.Schema;

// const schemaDefinition = new Schema(
//   {
//     name: { type: String },
//     location: { type: String },
//     date: { type: Date },
//     events: [],
//     users: [],
//     sport_id: { type: Array },
//     organizer_id: { type: mongoose.Schema.Types.ObjectId },
//     join_privacy: { type: Number },
//     statistics_info: { type: Array },
//     image: { type: String, default: null },
//   },
//   { versionKey: false, collection: "leagues", timestamps: true }
// );

// const exportModel = mongoose.model("leagues", schemaDefinition);
// module.exports = exportModel;
