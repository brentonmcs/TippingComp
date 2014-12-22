(function(database) {
    "use strict";
    var mongodb = require("mongodb");
    var mongoUrl = "mongodb://localhost:27017/tipping";
    var theDb = null;

    database.getDatabase = function(next) {
        if (!theDb) {
            mongodb.MongoClient.connect(mongoUrl, function(err, db) {
                if (err) {
                    next(err, null);
                } else {
                    theDb = {
                        db: db,
                        fixtures: db.collection("fixtures")
                    };

                    return next(null, theDb);
                }
            });

        } else {
            return next(null, theDb);
        }
    };
})(module.exports);
