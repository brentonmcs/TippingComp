'use strict';

var database = require('./Common/database');

database.getDatabase(function (err, db) {
   if (err) {
      console.log(err);
   } else {
      db.fixtures.count(function (err, count) {
         console.log(count);
      });
   }
});
