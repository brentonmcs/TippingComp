(function() {
    "use strict";
    var request = require("request");
    var cheerio = require("cheerio");
    var rabbit = require("./Common/rabbitMqConnect");
    var logger = require("./Common/logger");

    goToDraw("http://www.nrl.com/DrawResults/TelstraPremiership/Draw/tabid/11180/Default.aspx", goToNext);

    function goToNext($) {
        var nextRound = $(".dpNext").first();

        if (nextRound === undefined) {
            return;
        }

        var tail = $(".dpNext").first().parent().attr("href");
        var href = "http://www.nrl.com/" + tail;

        if (tail === undefined || tail === "") {
            return;
        }

        goToDraw(href, goToNext);
    }

    function goToDraw(uri, callback) {

        logger.info("Going to page " + uri);
        request({
                uri: uri

            },
            function(error, response, body) {

                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    readDraw($);
                    callback($);
                } else {
                    logger.error(error);
                }
            });
    }

    function readDraw($) {
        $(".drawCentre .drawPanel").each(function() {

            var panel = $(this);

            if (panel.hasClass("bye")) {
                return;
            }

            var matchcode = panel.attr("matchcode");

            var fixture = {
                homeTeam: matchcode.substring(0, matchcode.indexOf("-")),
                awayTeam: matchcode.substring(matchcode.indexOf("-") + 1),
                venue: $(".venue a", panel).text(),
                round: $(".round", panel).text(),
                matchDate: panel.attr("matchdate")
            };

            //Push to Queue
            rabbit.sendJson(fixture);
            logger.info(fixture);
        });
    }
})(module.exports);
