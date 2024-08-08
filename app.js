"use strict";
require("dotenv").config();
let constant = "./config/config.js";
process.config.global_config = require(constant);

let express = require("express"),
  app = express(),
  cors = require("cors"),
  responseHandler = require("./modules/middleware/responseHandler"),
  multer = require("multer"),
  http = require("http"),
  bodyParser = require("body-parser");
const httpServer = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(httpServer, { cors: { origin: "*" } });

console.log("Initializing Server.", new Date().toString());
console.log("Environment: " + process.env.NODE_ENV);
console.log("Loading Environment Constant: " + constant);

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,API-KEY"
  );
  next();
});

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
const docOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "rec_liga",
      version: "1",
    },
    servers: [
      {
        url: process.config.global_config.base_url,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-auth-token",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./modules/controllers/*.js", "./modules/controllers/Merchant/*.js"],
};

app.use("/public", express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.disable("x-powered-by");
app.use(function (req, res, next) {
  req.io = io;
  next();
});

console.log("Setting up success listener.");
app.use(responseHandler.onSuccess);

console.log("Setting up routes.");
require("./routes")(app);

console.log("Plugging the error leaks.");
app.use(responseHandler.onError);

console.log("Ready for requests.");

let port = Number(process.env.PORT || process.config.global_config.server.port);
httpServer.listen(port, function () {
  console.log("server listening on port " + httpServer.address().port);
});

httpServer.timeout = process.config.global_config.server.networkCallTimeout;
