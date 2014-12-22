(function() {
    "use strict";
    var rabbit = require("./Common/rabbitMqConnect");

    rabbit.receiveJson(function(json) {
        if (json.messageType && json.messageType === "Logging") {
            var message = json.message;
            if (typeof json.message === "object") {
                message = JSON.stringify(json.message);
            }

            console.log("Log Type:: " + json.logType + " Message : " + message);
        }
    });

})(module.exports);
