var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db.js')
app.use(bodyParser.json());

app.get('/wait', function (req, res) {
  // This will eventually ask the database for the wait times from all restaurants
  // and then send them back to Angular.

  db.getAvgWaitsLatestReportAllLocs (function (results){
    res.send(results);
  })
});

app.post('/wait', function (req, res) {
  // This accepts info from Angular and adds a report and restaurant record to the database.
  var data = req.body.data;

  /*
  expecting this format for req.body:

  {
    data: {
      google_id: "ChIJz7o2jgm1RIYRi_5Y7JfjH0A",
      name: "Perry's Steakhouse & Grille",
      longitude: -97.74351200000001,
      latitude: 30.269557,
      wait: 28
    }
  }

  */

  if (
    data.google_id === undefined ||
    data.name      === undefined ||
    data.longitude === undefined ||
    data.latitude  === undefined ||
    data.wait      === undefined
    ) {
    res.sendStatus(400); // bad request
  } else {
    db.addReport(data.google_id, data.wait, data.name, data.longitude, data.latitude);
    db.addRestaurant(data.name, data.google_id, data.longitude, data.latitude);
    res.sendStatus(200);
  }
});

app.use('/', express.static('client'));

var server = app.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

