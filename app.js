"use strict";

process.appConfig = {};
let constant = "./config/config.dev.js";
process.appConfig.global_config = require(constant);

let express = require("express"),
  app = express(),
  http = require("http"),
  server = http.createServer(app),
  socketio = require("socket.io"),
  path = require("path"),
  cors = require("cors"),
  router = require("./modules/routes/index.js"),
  responseHandler = require("./modules/middleware/responseHandler"),
  bodyParser = require("body-parser");
const admin = require("./modules/middleware/firebase_admin.js");

console.log("Initializing Server.");
console.log("Environment: " + process.env.NODE_ENV);
console.log("Loading Environment Constant: " + constant);

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
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

app.disable("x-powered-by");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname + "/uploads"));

console.log("Setting up success listener.");
app.use(responseHandler.onSuccess);

console.log("Setting up routes.");
app.use(router);

console.log("Plugging the error leaks.");
app.use(responseHandler.onError);

const messaging = admin.messaging();

module.exports = {app, messaging}

console.log("Ready for requests.");
let port = Number(
  process.env.PORT || process.appConfig.global_config.server.port
);
server.listen(port, "0.0.0.0", function () {
  console.log("server listening on port " + server.address().port);
});

server.timeout = process.appConfig.global_config.server.networkCallTimeout;

const io = socketio(server, { pingTimeout: 60000 });
require('./modules/middleware/socket.js')(io);
