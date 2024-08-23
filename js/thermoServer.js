
var myModule = require('./GPIO.js');
var variables = require('./variables.js');
const https = require('https');
const http = require('http');
var fs = require('fs');

var euanMortonIP = variables.euanMortonIP();

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


require('dotenv').config(); //.env file for config strings
const mysql = require('mysql2');
var moment = require('moment');



//cors stuff
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

//chekc if fridge on:
//get temp
//send to db


console.log("do the thing:!");
//TODO: change timer to more robust check
setTimeout(function () {
  var heatingStatus = myModule.getFridgeStatus();

  console.log("do the thing:!", heatingStatus);
  
  if(heatingStatus.fridgeStatus){
      sendTempToDB(heatingStatus.temperature);
  }

}, 10000);


function sendTempToDB(temp){
  var con = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password
  });


  temperatureInterval = setInterval(function () {

    var heatingStatus = myModule.getFridgeStatus();

    myModule.setTemperature()
    
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");


      //mysql format: YYYY-MM-DD hh:mm:ss

      var dateNtime = moment().format('YYYY-MM-DD hh:mm:ss');
      
      console.log("date2!", dateNtime);
      
      var query = 'INSERT INTO Pinter_Pi.Temperature (date, temperature, type)' +
                  'VALUES (convert("'+dateNtime+'",datetime), "' + heatingStatus.temperature +'", "test")';
      
      con.query(query, function (err, result) {
          if (err) throw err;
          console.log("result",result);
      });

      con.query("SELECT * FROM Pinter_Pi.Pi_Settings ORDER BY ID DESC LIMIT 1;", function (err, result) {
        if (err) throw err;
        console.log("result",result);
        myModule.setTemperature(result[0].temperature);

      });
    });  

  }, 1800000);	//1800000 30 mins
}





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);

console.log('Magic happens on port ' + port);
