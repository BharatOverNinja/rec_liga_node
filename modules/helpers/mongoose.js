"use strict";
require("dotenv").config();

const MongooseObj = require("mongoose").Mongoose;
const config = require("../../config/config.dev"); // Load the configuration module

const mongoose = new MongooseObj();

// Replace <password> with the actual password from the environment variable
const connectionString = config.mongodb.connection_string.replace(
  "<password>",
  process.env.MONGODB_PASSWORD
);

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'recliga'
});

mongoose.Promise = global.Promise;

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to Atlas.");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

module.exports = mongoose;
