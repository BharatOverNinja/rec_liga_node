'use strict';

let _                      = require('lodash');
module.exports = (io, socket, users) => {
    socket.on("get_new_notification_count",function(data) {
        console.log("get_new_notification_count",data);
        if (!data) { return false; }
        var userId = data.userId;
        if (!userId) { return false; }
        socket.emit("new_notification_count", {count:count});
    })
}
