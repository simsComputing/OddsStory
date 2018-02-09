// -------- MAIN -----------
//TODO: bwin: URLs sometimes correspond to groups within a competition. Right now, not gonna work with all competitions
// differentiate live and non live games
// keep testing everything with different leagues/sports/live for better robustness 
// get top foreign bookmakers   
// dictionnaries? 



var oddsPicker = require("./oddsPicker.js");
var maintenor = require("./maintenor.js");

var URLs = {
	pinnacle:[
		//['https://www.pinnacle.com/en/odds/match/basketball/usa/wnba','WNBA'], // tested, works
		['https://www.pinnacle.com/en/odds/match/soccer/france/ligue-1','Ligue 1'], //tested, works
	],
	betclic:[
		['https://www.betclic.fr/football/ligue-1-e4','Ligue 1'], // tested, works
		//['https://www.betclic.fr/basket-ball/wnba-e513','WNBA'], // tested, works
	], 
	unibet:[// page is loaded but selectors are late to appear --> needs a waitforselector to work. 
		['https://www.unibet.fr/sport/football/ligue-1','Ligue 1'], // tested, works
		//['https://www.unibet.fr/sport/basketball/wnba','WNBA'], // tested, works
	],
	bwin:[ //not working because loading different page before loading the actual page -- needs a waitforselector
		['https://sports.bwin.fr/fr/sports/4/19328/paris-sportifs/ligue-1','Ligue 1'], // tested, works
		//['https://sports.bwin.fr/fr/sports/7/20255/paris-sportifs/wnba','WNBA'], // tested, works
	],
	winamax:[
		['https://www.winamax.fr/paris-sportifs/sports/1/7/4','Ligue 1'], //tested, works
		//['https://www.winamax.fr/paris-sportifs/sports/2/800000077/591','WNBA'], //tested, works 
	],
	pmu:[
		['https://paris-sportifs.pmu.fr/pari/3/185/ligue-1','Ligue 1'], // tested, works
	],
	netbet:[
		['https://www.netbet.fr/football/france/96-ligue-1','Ligue 1'], // tested, works
		//['https://www.netbet.fr/basketball/etats-unis-f/8-wnba','WNBA'], // tested, works
	],
	fdj:[
		['https://www.enligne.parionssport.fdj.fr/paris-football/france/ligue-1','Ligue 1'], //tested, works
	],
	francepari:[
		['https://www.france-pari.fr/competition/96-parier-sur-ligue-1','Ligue 1'], //tested, works
		//['https://www.france-pari.fr/competition/8-parier-sur-wnba','WNBA'], //tested, works
	]
};

//oddsPicker.pickOdds(URLs.betclic,maintenor.betclic); 
//oddsPicker.pickOdds(URLs.pinnacle,maintenor.pinnacle); 
//oddsPicker.pickOdds(URLs.unibet,maintenor.unibet); 
//oddsPicker.pickOdds(URLs.bwin,maintenor.bwin); 
//oddsPicker.pickOdds(URLs.winamax,maintenor.winamax);
//oddsPicker.pickOdds(URLs.pmu,maintenor.pmu);
//oddsPicker.pickOdds(URLs.netbet,maintenor.netbet);	
//oddsPicker.pickOdds(URLs.fdj,maintenor.fdj);	
//oddsPicker.pickOdds(URLs.francepari,maintenor.francepari);	

var init = function (){
	oddsPicker.pickOdds(URLs.betclic,maintenor.betclic); 
	oddsPicker.pickOdds(URLs.pinnacle,maintenor.pinnacle); 
	oddsPicker.pickOdds(URLs.winamax,maintenor.winamax); 
	oddsPicker.pickOdds(URLs.unibet,maintenor.unibet); 
    //setTimeout(repeat, 30000);
}

init();