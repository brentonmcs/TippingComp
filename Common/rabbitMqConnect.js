(function(rabbitMqConnect) {
    "use strict";
    var amqp = require("amqplib");
    var queueName = "tipping";

    function connect(callback) {
        amqp.connect("amqp://localhost").then(function(conn) {

            process.once("SIGINT", function() {
                conn.close();
            });

            return conn.createChannel().then(function(ch) {

                var ok = ch.assertExchange(queueName, "fanout", {
                    durable: false
                });

                ok.then(function() {
                    callback(ok, ch);
                });
            });
        }).then(null, console.warn);
    }

    function send(message) {
        connect(function(ok, ch) {
            return ok.then(function() {
                ch.publish(queueName, "", new Buffer(message));
                return ch.close();
            });
        });
    }

    rabbitMqConnect.receive = function(callback) {

        connect(function(ok, ch) {

            ok = ok.then(function() {
                return ch.assertQueue("", {
                    exclusive: true
                });
            });

            ok = ok.then(function(qok) {
                return ch.bindQueue(qok.queue, queueName, "").then(function() {
                    return qok.queue;
                });
            });

            ok = ok.then(function(queue) {
                return ch.consume(queue, callback, {
                    noAck: true
                });
            });
        });
    };

    rabbitMqConnect.receiveJson = function(callback) {
        return rabbitMqConnect.receive(function(msg) {
            callback(JSON.parse(msg.content.toString()));
        });
    };

    rabbitMqConnect.sendJson = function(message) {
        send(JSON.stringify(message));
    };

})(module.exports);
