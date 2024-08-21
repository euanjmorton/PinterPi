
//var module = require('./moment.js');

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var thermoSensor = require('ds18x20');

var isLoaded = thermoSensor.isDriverLoaded();
console.log("is the driver loaded?", isLoaded);

if(!isLoaded){
	console.log('driver is loadin');
	try {
		thermoSensor.loadDriver();
		console.log('driver is loaded');
	} catch (err) {
		console.log('something went wrong loading the driver:', err);

	}
}
//else{
	
console.log('driver is loaded');
var listOfDeviceIds = thermoSensor.list();
console.log(listOfDeviceIds);
var temp = thermoSensor.get(listOfDeviceIds[0]);
console.log(temp);
//}


var temperatureInterval = null;
var tempToSet = 15;
var runningFridgeApp = false;

var digitToDisplay = 0;
var segdigitinterval = setInterval(getThermo, 5000);
var listOfSensorIds = '';
thermoSensor.list(function (err, listOfDeviceIds2) {
	//console.log(listOfDeviceIds);
	listOfSensorIds = listOfDeviceIds2[0];
});
function getThermo() {
	thermoSensor.get(listOfSensorIds, function (err, temp) {
		//console.log("temp", temp);
		digitToDisplay = parseInt(temp);
	});
}

//Outputs
var fridgePowerPin = new Gpio(12, 'out');
var heaterPowerPin = new Gpio(13, 'out');


/*var seven_Seg_1 = new Gpio(2, 'out');
var seven_Seg_2 = new Gpio(3, 'out');

var seven_Seg_A = new Gpio(21, 'out');
var seven_Seg_B = new Gpio(20, 'out');
var seven_Seg_C = new Gpio(26, 'out');
var seven_Seg_D = new Gpio(19, 'out');
var seven_Seg_E = new Gpio(13, 'out');
var seven_Seg_F = new Gpio(6, 'out');
var seven_Seg_G = new Gpio(5, 'out');*/


//Inputs
//var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
//var tempUpSwitch = new Gpio(25, 'in', 'both');
//var tempDownSwitch = new Gpio(9, 'in', 'both');

//seven_Seg_1.write(0);
//seven_Seg_2.write(0);
fridgePowerPin.write(1);

var timeOfOn = 0;
var changeToDisplay = false;
var seven_Seg_1_Control = false;
var seven_Seg_2_Control = false;







var runFridgeApp = function(){

	//console.log("fridge app: ", runningFridgeApp);

	if(runningFridgeApp){
		runningFridgeApp = false;
		clearInterval(temperatureInterval);

		fridgePowerPin.write(0);//on
		fridgeStatus = true;
	}
	else{
		runningFridgeApp = true;
		start();
	}


	return "runningFridgeApp" + runningFridgeApp;
}

runFridgeApp();

//start();

async function start() {
	console.log("start called: ", runningFridgeApp);
	var listOfDeviceIds = thermoSensor.list();

	//while(runningFridgeApp){
	temperatureInterval = setInterval(function () 
		{
			var temp = thermoSensor.get(listOfDeviceIds[0]);

			temp = parseInt(temp);

			if(temp > tempToSet){
				//pin/fridge on
				fridgePowerPin.write(0);//on
				heaterPowerPin.write(1);//off
			}
			else if(temp < tempToSet){
				fridgePowerPin.write(1);//off
				heaterPowerPin.write(0);//on
			}
			else{
				fridgePowerPin.write(1);//off 
				heaterPowerPin.write(1);//off
			}



			//await new Promise(resolve => setTimeout(resolve, 10000));
			console.log("CHECK TEMP", temp, tempToSet);
		}, 10000);	
		
}



var count8 = 0;


var myHeatTimer = null;

var getTemperature = function() {	
	var listOfDeviceIds = thermoSensor.list();
	var temp = thermoSensor.get(listOfDeviceIds[0]);

	return temp;  
}

var setTemperature = function(res, req) {	
	console.log("res", res);
	console.log("req", req);
	return temp;  
}

var getTemperatureMessage = function() {	
	var listOfDeviceIds = thermoSensor.list();
	//console.log(listOfDeviceIds);

	var temp = thermoSensor.get(listOfDeviceIds[0]);
	//digitToDisplay = parseInt(temp);

	return { message: 'Temperature', temperature: digitToDisplay };  
}
var getSetTemp = function() {
	return { message: 'Temp set to:' + tempToSet };  
}


var getFridgeStatus = function(){
	var fridgeStatus = false;
	var heaterStatus = false;
	var message = "";

	if (fridgePowerPin.readSync() === 0) {
		fridgeStatus = true;
		message += "Fridge is ON. "
	} 
	else{
		message += "Fridge is OFF. "
	}

	if (heaterPowerPin.readSync() === 0) {
		heaterStatus = true;
		message += "Heating is ON. "
	} 
	else{
		message += "Heating is OFF. "
	}

	/*else {
		object = { message: 'Heating is OFF.', temperature: digitToDisplay };  
		return object;
	}*/


	return { 
			message: message,
			isAppRunning: runningFridgeApp,
			fridgeStatus: fridgeStatus,
			time: timeOfOn,
			temperature: digitToDisplay,
			LastUpdated: 0
		};  
}




/* 
 * TODO:
 * module.exports = { printTest, tempTest, etc}
 * Simplify functioncalling in module exports
 */
module.exports = {
	runFridgeApp,
	//tempTest,
	getTemperature,
	getFridgeStatus
}
	