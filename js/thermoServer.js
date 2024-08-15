
var myModule = require('./GPIO.js');
var variables = require('./variables.js');
const https = require('https');
const http = require('http');
var fs = require('fs');

var euanMortonIP = variables.euanMortonIP();

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

//cors shit
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 3000;        // set our port



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.get('/getFridgeStatus', function(req, res) {
  var heatingStatus = myModule.getFridgeStatus();
  res.json(heatingStatus);
});

router.get('/toggleHeatingPin', function(req, res) {
  res.json(myModule.toggleHeating());
});
router.get('/getTemperature', function(req, res) {
  res.json(myModule.getTemperature());
});
router.get('/setTemperature', function(req, res) {
  res.json(myModule.setTemperature());
});
router.get('/runFridgeApp', function(req, res) {
  res.json(myModule.runFridgeApp());
});





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);

console.log('Magic happens on port ' + port);
