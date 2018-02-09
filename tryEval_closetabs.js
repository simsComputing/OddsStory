// HEY ALEX. JE LAISSE EN COMMENTAIRE ICI CE QU'IL MANQUE.
// IL FAUT CHECKER POURQUOI "HEADLESS ERROR PHANTOM PROCESS DIED" APPARAIT A CHAQUE FOIS. 
// IL FAUT GERER LA SAUVEGARDE DANS LA DB. AJOUTER A CHAQUE COTE SAUVEGARDER LE NOM DU BOOKIE POUR ENREGISTRER DANS LE BON FICHIER DE DB.
// IL FAUT EGALEMENT AJOUTER POUR LA SAUVEGARDE DANS LA DB LE NOM DE LA LIGUE CONCERNEE.

//----- PINNACLE script function -----------

var Horseman = require("node-horseman");

// DB Object creation 
var Datastore = require('nedb'); 
var tryOdds = new Datastore({ filename: 'tryOdds.db', autoload: true });

//Horseman object with options
var horseman = new Horseman({
	ignoreSSLErrors: true, 
	loadImages: false, 
	timeout: 15000, 
});

//URLs Strings to be opened and scraped 
var URLs = [
'https://www.pinnacle.com/fr/odds/today/e-sports', // E sports
'https://www.pinnacle.com/fr/odds/match/basketball/france/france-championnat-pro-a', // PRO A
'https://www.pinnacle.com/en/odds/match/basketball/usa/wnba', // WNBA
'https://www.pinnacle.com/en/odds/live/golf/new-markets/pga-tour-us-open', 
'https://www.pinnacle.com/en/odds/today/soccer'
];

//Selectors Strings for Pinnacle 
strOddsSelector = "td.game-moneyline"; 
strTeamNameSelector = "td.game-name"; 

//UserAgent String
strUserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"; 

//Number of URLs opened 
var nTabs = URLs.length; 

//Variables defined in the global context to handle selectors, tabs and time
var tabCompleted = 0;
var selectors_tested = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0);
var arrayMapper = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0);
for(var i=0; i<nTabs; i++){
	arrayMapper[i] = i+1; 
}
var startTime = new Date().getTime();
var timeOddsPicking; 

var oddsLists = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0); 
var teamNameLists = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0); 

	
horseman.userAgent(strUserAgent)

startHorseman = function(horseman, url, tabNB){
	console.log('Opening URL ' + url); 
	horseman
	.openTab(url).status().then((sta) => {
		if (sta != 200) {
			console.log('Wrong status!'); 
		}
	})
	.exists(strOddsSelector).then((bool) => {
		if (bool) {
			console.log("Evaluating moneyline selector...")
			horseman
			.evaluate(function(selector){
				var list = []; 
				for(var i=0; i<$(selector).length; i++){
					list.push($(selector)[(i).toString()].innerText.split("\n")[0]);
				}
				return list; 
			},strOddsSelector).then((list) => {
				timeOddsPicking = new Date().getTime();
				oddsLists[tabNB] = list; 
				return close_tab(horseman,tabNB);
			})
		}
		else{
			console.log('Moneyline selector does not exist.');
			 oddsLists[tabNB] = []; 
			return close_tab(horseman,tabNB); 
		}            
	})
	.exists(strTeamNameSelector).then((bool) => {
		if (bool) {
			horseman
			.evaluate(function(selector){
				var list = []; 
				for(var i=0; i<$(selector).length; i++){
					list.push($(selector)[(i).toString()].innerText);
				}
				return list; 
			},strTeamNameSelector).then((list) => {
				teamNameLists[tabNB] = list; 
				return close_tab(horseman,tabNB);
			})
		}
		else{
			console.log('Team name selector does not exist.');
			teamNameLists[tabNB] = [];
			return close_tab(horseman,tabNB); 
		}
	})
	.catch(function(err){
		console.log("Got into error catcher : " + err); 
		saveOdds(); 
		tryWithNewInstance(); 
		return horseman.close(); 
	})
}

// --------- MAIN 
var currentTab = 0; 
startHorseman(horseman, URLs[currentTab], currentTab);



//---------- SIDE FUNCTIONS

//This function is called if one of the tabs URL fail to be loaded. 
//Launches horseman with a new instance
function tryWithNewInstance(){

	console.log("Trying with a new instance of horseman...")
	wait(2000); 
	horsemanRetry = new Horseman({
		ignoreSSLErrors: true, 
		loadImages: false, 
		timeout: 15000, 
	});
	selectors_tested = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0); 
	arrayMapper = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0); 
	for(var i=0; i<nTabs; i++){
	arrayMapper[i] = i+1; 
}
	tabCompleted = 0; 
	currentTab = 0; 
	startHorseman(horsemanRetry,URLs[currentTab],currentTab); 

}
//Checks whether all the URL selectors have been processed. If so, closes the tab and opens the following URL.
//Then, checks whether all the tabs have been processed. If so, saves the odds and closes the horseman instance. 
function close_tab(horseman,numTab) {

	selectors_tested[numTab]++;
	console.log("Selector completed! vect is now " + selectors_tested); 
	if (selectors_tested[numTab] == 2) {
		console.log('Finished tab number ' + numTab); 
		shiftTabsNumber(numTab); 
		console.log('Arraymapper is now ' + arrayMapper);
		tabCompleted++; 
		currentTab++; 
		if(currentTab < nTabs){
			horseman.closeTab(arrayMapper[numTab]); 
			startHorseman(horseman,URLs[currentTab],currentTab);			
		}
		if(tabCompleted == nTabs){
			console.log('Closing horseman object and saving odds into DB...');
			saveOdds();  
			return horseman.close();
		}
	}

}

//Handles the horseman tabs number when closing a tab.  
function shiftTabsNumber(numTab){

	for(var i=numTab+1; i<nTabs;i++ ){
		arrayMapper[i]--; 
	}

}

//The following functions are used to process the lists retrieved from the selectors and save the team names and odds into the DB. 
function saveOdds() {

	games = {}; 
	for (var j=0; j<nTabs; j++){
		var bookieName = parseBookieURL(URLs[j]);
		var leagueName = parseLeagueURL(URLs[j]); 
		var oddListTab = oddsLists[j];
		var teamNameListTab = teamNameLists[j];
		if(games[bookieName] == undefined){
			games[bookieName] = [];
		}
		if(leagueName == 'soccer'){
			games = createGameObjThreeOutcomes(games,oddListTab,teamNameListTab,leagueName,bookieName); 
		}
		else{
			games = createGameObjTwoOutcomes(games,oddListTab,teamNameListTab,leagueName,bookieName); 		
		}
	}
	//loop on keys to insert into DB
	console.log(games);
	var endTime = new Date().getTime();
	console.log('It took ' + (endTime - startTime) + ' to retrieve these odds'); 

}


function createGameObjTwoOutcomes(games,oddListTab,teamNameListTab,leagueName,bookieName){

	if(oddListTab != undefined && teamNameListTab != undefined){
	var ngames = oddListTab.length/2; 
		for (var i=0; i<ngames; i++){
			var hometeamName = teamNameListTab[2*i+1]; 
			var awayteamName = teamNameListTab[2*i]; 
			var homeOdd = oddListTab[2*i+1]; 
			var awayOdd = oddListTab[2*i];
			if(oddAndTeamNameFilter(hometeamName,awayteamName,homeOdd,awayOdd)){
				games[bookieName].push({
					home_team: hometeamName, 
					away_team: awayteamName, 
					home_odd: homeOdd, 
					away_odd: awayOdd,
					league: leagueName, 
					bookmaker: bookieName,
					time: timeOddsPicking,
				});
			}
		}
        //tryOdds.insert(games[j], function (err, newDoc) {});
	}
	return games;

}

function createGameObjThreeOutcomes(games,oddListTab,teamNameListTab,leagueName,bookieName){

	if(oddListTab != undefined && teamNameListTab != undefined){
		for (var i=0; i<teamNameListTab.length; i++){
			if(teamNameListTab[i] == 'Draw'){
				var hometeamName = i-1 > -1 ? teamNameListTab[i-1] : ''; 
				var awayteamName = i-2 > -1 ? teamNameListTab[i-2] : ''; 
				var homeOdd = i-2 > -1 ? oddListTab[i-1] : ''; 
				var awayOdd = i-2 > -1 ? oddListTab[i-2] : ''; 
				var drawOdd = oddListTab[i];
				if(oddAndTeamNameFilter(hometeamName,awayteamName,homeOdd,awayOdd)){
					games[bookieName].push({
						home_team: hometeamName, 
						away_team: awayteamName, 
						home_odd: homeOdd, 
						away_odd: awayOdd,
						draw_odd: drawOdd,
						league: leagueName, 
						bookmaker: bookieName,
						time: timeOddsPicking,
					});
				}
			}
		}
        //tryOdds.insert(games[j], function (err, newDoc) {});
	}
	return games; 
}

//Returns true if the team names and odds look correct. To be updated: Check if names are in the proper dictionnaries 
function oddAndTeamNameFilter(homeName,awayName,homeOdd,awayOdd){

	return !isNaN(homeOdd) && !isNaN(awayOdd); 
}

//Function to wait for <ms> milliseconds before executing next line of code. 
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

//Parse the bookmaker name or league name from the URL 
function parseBookieURL(url) {
	var begin = url.search("www.") + 4;
	var domain = "";
	for (i = begin; url[i] != "."; i++) {
		domain += url[i];
	}
	return domain;
}

function parseLeagueURL(url) {
	var league = ""; 
	ind = url.length-1; 
	while(url[ind] != '/' && ind > -1){
		league = url[ind] + league; 
		ind--; 
	}
	return league;
}
