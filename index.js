var fs = require("fs");
var access = fs.createWriteStream('log/error.log');
process.stdout.write = process.stderr.write = access.write.bind(access);

process.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});


var nba = require("./nba.js");
var wnba = require("./wnba.js");
var champ = "wnba";

var repeat = function (){
   if (champ == "wnba") {
	wnba.pickOddsWNBAPinnacle(); 
    	wnba.pickOddsWNBAWinamax();
    	wnba.pickOddsWNBABetclic(); 
    	wnba.pickOddsWNBAUnibet();
    	wnba.pickOddsWNBABwin();
	champ = "nba";
} else if (champ == "nba") {
    nba.pickOddsNBAPinnacle(); 
    nba.pickOddsNBAWinamax();
    nba.pickOddsNBABetclic(); 
    nba.pickOddsNBAUnibet();
    nba.pickOddsNBABwin();
	champ = "wnba";
}
    setTimeout(repeat, 30000);
}

repeat();
