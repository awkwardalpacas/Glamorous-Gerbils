var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('received a GET request at /. This will eventually serve the map');
});

app.get('/reports', function (req, res) {
  res.send('received a GET request at /reports');
});

app.post('/reports', function (req, res) {
  res.send('received a POST request at /reports');
});

app.use('/static', express.static('client'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
