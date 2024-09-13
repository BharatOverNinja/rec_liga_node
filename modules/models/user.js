const mongoose = require("../helpers/mongoose");
const Schema = mongoose.Schema;

const schemaDefinition = new Schema(
  {
    full_name: { type: String },

    nick_name: { type: String },

    email: { type: String },

    phone: { type: String },

    token: { type: String },

    isOnline: { type: Boolean, default: false },

    socket_id: { type: String, default: "" },

    role: { type: String, enum: ["Player", "League Organizer"] }, // league_organizer, player

    profile_picture: { type: String, default: null },

    date_of_birth: { type: Date },

    city: { type: String },

    sports: [{ type: String }],

    rank: { type: Number, },

    points: { type: Number, },

    wins: { type: Number, },

    losses: { type: Number, },

    ties: { type: Number, },

    cw: { type: Number, },

    att: { type: Number, },

    positions: [{ type: String }],

    player_rating: { type: Number, min: 0, max: 3, },

    date: { type: Date, default: Date.now },
  },
  { versionKey: false, collection: "users", timestamps: true }
);

schemaDefinition.pre("save", function (next) {
  if (this.role === "Player") {
    this.rank = this.rank || "";
    this.points = this.points || 0;
    this.wins = this.wins || 0;
    this.losses = this.losses || 0;
    this.ties = this.ties || 0;
    this.player_rating = this.player_rating || 0;
  }
  next();
});

const exportModel = mongoose.model("users", schemaDefinition);
module.exports = exportModel;
