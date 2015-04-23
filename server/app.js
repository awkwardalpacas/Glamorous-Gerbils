var express    = require('express');
var bodyParser = require('body-parser');
var db         = require('./db.js');

var app = express();
app.use('/', express.static('client'));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('NomNow server is listening at http://%s:%s', host, port);
  db.init();
});


// This asks the database for the info the client needs.
// The client will use that info to make a marker on the map.
app.get('/wait', function (req, res) {
  db.getAvgWaitsLatestReportAllLocs (function (results){
    res.send(results);
  })
});

// This accepts data from the client.
// If the data looks good, it add a restaurant and report record.
app.post('/wait', function (req, res) {
  var data = req.body.data;
  if (
    data.google_id === undefined ||
    data.name      === undefined ||
    data.longitude === undefined ||
    data.latitude  === undefined ||
    data.wait      === undefined
    ) {
    res.sendStatus(400);
  }

  else {
    db.addReport(data.google_id, data.wait, data.name, data.website, data.longitude, data.latitude);
    db.addRestaurant(data.name, data.website, data.google_id, data.longitude, data.latitude);
    res.sendStatus(200);
  }
});

// app.post('/newtime', function(req, res) {
//   var phoneNumber = req.body.phoneNumber;
//   var wait = req.body.wait; //do some parsing to remove text, etc.

//   //select google_id from restaurants where restaurants.phoneNumber = phoneNumber

//   //insert wait into reports where google_id = 
//   //insert sql query into our database
//   db.addReport(foundGoogleID, wait);

// })

// To post data, use this format in the post request:

// {"data":   {
//         "google_id": "ChIJ1XlZ4Qm1RIYR4rpevy6Ybs4",
//         "name": "Roaring Fork",
//         "website": "http://roaringfork.com",
//         "longitude": -97.74213199999997,
//         "latitude": 30.269059,
//         "wait": 15
// }}

// var tropo_webapi = require('tropo-webapi');
var request = require('request');

app.post('/testing', function(req, res) {
  // var phoneNumber = '+19563939777'
  // var tropo = new TropoWebAPI()
  // tropo.call(phoneNumber)
  // tropo.say('This is only a test.')
  // res.end(TropoJSON(tropo))
  console.log('Request query: ',req.query)
  console.log('This is the request: ',req)

  var transcript = req.body.result.transcription
  var time = ''
  for (var i = 0; i < transcript.length; i++) {
    if(!!+transcript[i] || transcript[i] === '0') {
      time+=transcript[i]
    }
  }

  time = +time

  console.log('The wait is '+time+' minutes.')
  res.end('test')
})

app.get('/demophonecall', function(req, res) {
  var tropoUrl = 'https://api.tropo.com/1.0/sessions?action=create&token=08d323148e34ce499bc74a0059bd29f54f10607d0f1837899118f7f1568e7ef017faf939f1af872c552e7bc5'
  var phoneNumber = '&phoneNumber=1'+req.query.phone
  var url = tropoUrl+phoneNumber
  // console.log(phoneNumber, url)
  request(url, function(error, response, body) {
    console.log(response.statusCode, body)
  })
  res.redirect('/')
})
