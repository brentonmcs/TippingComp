var rabbit = require('./rabbitMqConnect')

rabbit.receive(function (message) {
	console.log("* - Received -" + message.content.toString());
});