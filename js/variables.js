/*
 * - - - - - - - - - - - - - - - -
 * Global variables used by thermo
 * - - - - - - - - - - - - - - - -
 */

var euanMortonIP = function() {
  var isDebug = true;
  //var isDebug = false;

  console.log("DEBUG: " + isDebug);

  if(isDebug){
    return "http://192.169.0.28:80/api/";
  }
  else{
    return "http://www.euanmorton.co.uk/api/";
  }
}

module.exports = {
	euanMortonIP
}
	
