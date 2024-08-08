let socket = require('socket.io');
let osClientSocket = {};
let io = null;

exports.io = function () {
  return io;
};

exports.initialize = function(server) {
  	return io = socket(server);
};

exports.getOSClientSocket = function () {
  return osClientSocket;
};
