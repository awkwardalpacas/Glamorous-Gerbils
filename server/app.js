var express = require('express');
var app = express();

app.get('/wait', function (req, res) {
  // This will eventually ask the database for the wait times from all restaurants
  // and do a join to get the average wait then send them back to Angular.
  var fakeData = [
    { "google_id": "ChIJz7o2jgm1RIYRi_5Y7JfjH0A", "wait": 15, "timestamp": "2015-04-10 12:00:01"},
    { "google_id": "ChIJ1XlZ4Qm1RIYR4rpevy6Ybs4", "wait": 10, "timestamp": "2015-04-10 12:22:01"},
    { "google_id": "ChIJ-yElAAq1RIYRiJYnsvPyhUY", "wait": 5,  "timestamp": "2015-04-10 12:24:01"},
    { "google_id": "ChIJf9x0-Qm1RIYRR9RPGWhe9Tg", "wait": 25, "timestamp": "2015-04-10 12:35:01"},
    { "google_id": "ChIJl_CT7Qm1RIYRmiQYoWVnXp8", "wait": 13, "timestamp": "2015-04-10 12:49:01"},
    { "google_id": "ChIJ0YsSvwm1RIYRN6TKC9_caXo", "wait": 5,  "timestamp": "2015-04-10 12:12:01"},
    { "google_id": "ChIJWQDHxwm1RIYRJmu_M83GQlI", "wait": 50, "timestamp": "2015-04-10 12:00:01"},
    { "google_id": "ChIJoQKzBAq1RIYR9vDjI9c6QZs", "wait": 7,  "timestamp": "2015-04-10 12:00:01"},
    { "google_id": "ChIJ34ezcAi1RIYRqGgNoPE6p4I", "wait": 11, "timestamp": "2015-04-10 12:00:01"},
    { "google_id": "ChIJ0YsSvwm1RIYR7No0oJyKROg", "wait": 21, "timestamp": "2015-04-10 12:00:01"}
  ] ;
  res.send(fakeData);
});

app.post('/wait', function (req, res) {
  // This will eventually accept a wait time from Angular and add it to the database.
  res.send('received a POST request at /wait.');
});

app.use('/', express.static('client'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
