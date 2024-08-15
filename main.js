
var IP = "http://192.168.1.248"; //:3000/";
//var IP = "http://192.168.43.72:3000/";    //phone ip
var $ = jQuery.noConflict();
var setTemperature = null;

$( document ).ready(function() {
  console.log( "ready!" );


  getFridgeStatus(function() {
    console.log('Received response:');
    $('#titleTemp').text(setTemperature);
  });
  
  
  
});

function getFridgeStatus(callback){
  $.ajax({
    url: IP + ":3000/api/getFridgeStatus",   // request url
    dataType: 'json', // type of response data
    crossDomain: true,
    timeout: 4000,     // timeout milliseconds
    success: function (data,status,xhr) {   // success callback function
      setTemperature = data.temperature;
      var message = data.message + "\n" + "Temp: " + data.temperature;// + "\°c".
      if(data.isAppRunning){
        $('#heatingMessage').text(message);
        
      }
      else{
        $('#heatingMessage').text("App not running, Fridge is ON. " + data.temperature);
      }
      
      var dt = new Date();
      var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
      $('#heatingTime').text("Last updated: " + time);

      //return("done")

      if(callback){
            callback();
      }
    },
    error: function (jqXhr, textStatus, errorMessage) { // error callback 
      console.log('error: ' + textStatus); 
      console.log('data: ' + errorMessage);
      
    }
  });
}

function toggleFridge(){
  $.ajax({
    url: IP + ":3000/api/runFridgeApp",   // request url
    dataType: 'json', // type of response data
    crossDomain: true,
    timeout: 500,     // timeout milliseconds
    success: function (data,status,xhr) {   // success callback function
      $('#heatingMessage').text(data.message);
      var dt = new Date();
      var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
      $('#heatingTime').text("Last updated: " + time);
    },
    error: function (jqXhr, textStatus, errorMessage) { // error callback 
      $('#heatingMessage').text(errorMessage);
    }
  });
}

function setTemperature(){

  var tempToSet = $("$setTemp").val();
  console.log("new temp set to: ", tempToSet)

  $.ajax({
    url: IP + ":3000/api/setTemperature",   // request url
    dataType: 'json', // type of response data
    data: tempToSet,
    crossDomain: true,
    timeout: 500,     // timeout milliseconds
    success: function (data,status,xhr) {   // success callback function
      $('#setTempMessage').text(data.message);
      var dt = new Date();
      var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
      $('#heatingTime').text("Last updated: " + time);
    },
    error: function (jqXhr, textStatus, errorMessage) { // error callback 
      $('#setTempMessage').text(errorMessage);
    }
  });
}