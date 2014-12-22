	(function(logger) {
	    "use strict";
	    var rabbit = require("./rabbitMqConnect");

	    function sendLog(type, message) {
	        rabbit.sendJson({
	            messageType: "Logging",
	            logType: type,
	            message: message
	        });
	    }

	    logger.info = function(message) {
	        sendLog("Info", message);
	    };

	    logger.warn = function(message) {
	        sendLog("Warn", message);
	    };

	    logger.error = function(message) {
	        sendLog("Error", message);
	    };

	})(module.exports);
