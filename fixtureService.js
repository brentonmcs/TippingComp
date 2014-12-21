var rabbit = require('./rabbitMQConnect')
var database = require('./database')

rabbit.receiveJson(function(json) {

    database.getDatabase(function(err, db) {
        if (err) {
            console.log(err);
        } else {
            db.fixtures.find({
                round: json.round,
                homeTeam: json.homeTeam
            }).count(function(err, count) {
                if (err) {
                    console.log('Failed to get count of fixtures');
                } else {
                    if (count === 0) {
                        console.log('adding to the db');

                        db.fixtures.insert(json, function(err) {
                            if (err) {
                                console.log('failed to add to database');
                            }
                        })
                    } else {
                    	console.log("already has record");
                    }
                }
            });
        }
    });
});
