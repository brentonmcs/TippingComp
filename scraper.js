var request = require("request");
var cheerio = require("cheerio");
var rabbit = require('./rabbitMqConnect');

goToDraw("http://www.nrl.com/DrawResults/TelstraPremiership/Draw/tabid/11180/Default.aspx", goToNext);

function goToNext($) {
    var nextRound = $('.dpNext').first();

    if (nextRound === undefined) {
        return;
    }

    var tail = $('.dpNext').first().parent().attr('href');
    var href = "http://www.nrl.com/" + tail;

    if (tail === undefined || tail === "") {
        return;
    }

    goToDraw(href, goToNext);
}

function goToDraw(uri, callback) {

    request({
                uri: uri
            
        },
        function(error, response, body) {

            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                readDraw($);
                callback($);
            } else {
            	console.log(error);
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
            homeTeam: matchcode.substring(0, matchcode.indexOf('-')),
            awayTeam: matchcode.substring(matchcode.indexOf('-') + 1),
            venue: $('.venue a', panel).text(),
            round: $('.round', panel).text(),
            matchDate: panel.attr('matchdate')
        }

        rabbit.sendJson(fixture);
        //Push to Queue
        console.log(fixture);
    });
}
