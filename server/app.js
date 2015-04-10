var express = require('express');
var app = express();

app.get('/wait', function (req, res) {
  res.send('received a GET request at /wait. This will eventually ask the database
    for the wait times based for the restaurants in that area and then send them back
    to Angular.');
});

app.post('/wait', function (req, res) {
  res.send('received a POST request at /wait. This will eventually accept a wait time
    from Angular and add it to the database.');
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
