(function () {
   "use strict";
   var rabbit = require("./Common/rabbitMqConnect");

   rabbit.receive(function (message) {
      console.log("* - Received -" + message.content.toString());
   });

})(module.exports);
