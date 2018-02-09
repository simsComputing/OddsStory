var Horseman = require("node-horseman");

var Datastore = require('nedb'); 
var tryOdds = new Datastore({ filename: 'tryOdds.db', autoload: true });

horseman = new Horseman({
	ignoreSSLErrors: true, 
	loadImages: false, 
	//timeout: 5000, 
});
var selectors_tested = 0;
var tabCompleted = 0;
var startTime = new Date().getTime();
var oddsList = []; 
var teamNameList = []; 
var timeOddsPicking; 
var selectorNotWorking = false; 
launch = function(horseman){

console.log('Opening URL...')
horseman
.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
.open('https://www.pinnacle.com/fr/odds/match/basketball/italy/italy-lega-a')
.status().then((sta) => {
	if (sta != 200) {
		console.log('Wrong status!'); 
	}
})
.exists("td.game-moneyline").then((bool) => {
	if (bool) {
		console.log("Evaluating moneyline selector...")
		horseman.evaluate(function(selector){
			var list = []; 
			for(var i=0; i<$(selector).length; i++){
				list.push($(selector)[(i).toString()].innerText.split("\n")[0]);
			}
			return list; 
		},"td.game-moneyline").then((list) => {
			//oddsList = text.split("\n").filter(Number); 
			timeOddsPicking = new Date().getTime();
			//oddsList = list; 
			oddsListNBA = list; 
			return close_tab(horseman,2);
		})
	}
	else{
		console.log('Moneyline selector does not exist.');
		oddsListNBA = []; 
		return close_tab(horseman,2); 
	}            
})
.exists("td.game-name").then((bool) => {
	if (bool) {
		horseman.evaluate(function(selector){
			var list = []; 
			for(var i=0; i<$(selector).length; i++){
				list.push($(selector)[(i).toString()].innerText);
			}
			return list; 
		},"td.game-name").then((list) => {
			//oddsList = text.split("\n").filter(Number); 
			//teamNameList = list; 
			teamNameListNBA = list; 
			return close_tab(horseman,2);
		})
	}
	else{
		console.log('Team name selector does not exist.');
		teamNameListNBA = [];
		return close_tab(horseman,2); 
	}
})
.openTab('https://www.pinnacle.com/fr/odds/match/basketball/europe/europe-vtb-united-league')
//.switchToTab(1)
.status().then((sta) => {
	if (sta != 200) {
	}
})
.exists("td.game-moneyline").then((bool) => {
	if (bool) {
		console.log("Evaluating moneyline selector...")
		horseman.evaluate(function(selector){
			var list = []; 
			for(var i=0; i<$(selector).length; i++){
				list.push($(selector)[(i).toString()].innerText.split("\n")[0]);
			}
			return list; 
		},"td.game-moneyline").then((list) => {
			//oddsList = text.split("\n").filter(Number); 
			timeOddsPicking = new Date().getTime();
			//oddsList = list; 
			oddsListVTB = list; 
			return close_tab(horseman,1);
		})
	}
	else{
		console.log('Moneyline selector does not exist.');
		oddsListVTB = []; 
		return close_tab(horseman,1); 
	}            
})
.exists("td.game-name").then((bool) => {
	if (bool) {
		horseman.evaluate(function(selector){
			var list = []; 
			for(var i=0; i<$(selector).length; i++){
				list.push($(selector)[(i).toString()].innerText);
			}
			return list; 
		},"td.game-name").then((list) => {
			teamNameListVTB = list; 
			return close_tab(horseman,1);
		})
	}
	else{
		console.log('Team name selector does not exist.');
		teamNameListVTB = []; 
		return close_tab(horseman,1); 
	}
})
//.switchToTab(0)
.openTab("https://www.pinnacle.com/fr/odds/match/basketball/france/france-championnat-pro-a")
.status().then((sta) => {
	console.log(sta);
	if (sta != 200) {
	}
})
.exists("td.game-moneyline").then((bool) => {
	if (bool) {
		console.log("Evaluating moneyline selector...")
		horseman.evaluate(function(selector){
			var list = []; 
			for(var i=0; i<$(selector).length; i++){
				list.push($(selector)[(i).toString()].innerText.split("\n")[0]);
			}
			return list; 
		},"td.game-moneyline").then((list) => {
			//oddsList = text.split("\n").filter(Number); 
			timeOddsPicking = new Date().getTime();
			//oddsList = list; 
			oddsListPROA= list; 
			return close_tab(horseman,0);
		})
	}
	else{
		console.log('Moneyline selector does not exist.');
		oddsListPROA = []; 
		return close_tab(horseman); 
	}            
})
.exists("td.game-name").then((bool) => {
	if (bool) {
		horseman.evaluate(function(selector){
			var list = []; 
			for(var i=0; i<$(selector).length; i++){
				list.push($(selector)[(i).toString()].innerText);
			}
			return list; 
		},"td.game-name").then((list) => {
			//oddsList = text.split("\n").filter(Number); 
			//teamNameList = list; 
			teamNameListPROA = list; 
			return close_tab(horseman,0);
		})
	}
	else{
		console.log('Team name selector does not exist.');
		teamNameListPROA = []; 
		return close_tab(horseman); 
	}
})
.catch(function(err){
	console.log(err); 
	tryagain(); 
	return horseman.close(); 
})


}

launch(horseman);

function tryagain(){
	wait(2000); 
	horsemanRetry = new Horseman({
	});
	selectors_tested = 0; 
	tabCompleted = 0; 
	launch(horsemanRetry); 
}

function close_tab(horseman) {
	selectors_tested++;
	if (selectors_tested == 2) {
		console.log('Closing horseman tab ..'); 
		tabCompleted++; 
		selectors_tested = 0; 
		if(tabCompleted == 3){
			console.log('Closing horseman object..');
			saveOdds();  
			return horseman.close(); 
		}
	}
}

// function handle_tabOnError(){
// 	tabCompleted++; 
// 	if(tabCompleted == 3){
// 		console.log('Closing horseman object..');
// 		return horseman.close(); 
// 	}
// }

function saveOdds() {
	gamesNBA = []; 
	var ngamesNBA = oddsListNBA.length/2;
	if(teamNameListNBA != undefined && oddsListNBA != undefined){
		for (var i=0; i<ngamesNBA; i++){
				gamesNBA.push({
					home_team: teamNameListNBA[2*i+1], 
					away_team: teamNameListNBA[2*i], 
					home_odd: oddsListNBA[2*i+1], 
					away_odd: oddsListNBA[2*i],
					time: timeOddsPicking,
				})
		}
		console.log(gamesNBA);
	}


	gamesVTB = []; 
	var ngamesVTB = oddsListVTB.length/2; 
	if(teamNameListVTB != undefined && oddsListVTB != undefined){
		for (var i=0; i<ngamesVTB; i++){
				gamesVTB.push({
					home_team: teamNameListVTB[2*i+1], 
					away_team: teamNameListVTB[2*i], 
					home_odd: oddsListVTB[2*i+1], 
					away_odd: oddsListVTB[2*i],
					time: timeOddsPicking,
				})
		}
		console.log(gamesVTB);	
	}

	gamesPROA = []; 
	var ngamesPROA = oddsListPROA.length/2; 
	if(teamNameListPROA != undefined && oddsListPROA != undefined){
		for (var i=0; i<ngamesPROA; i++){
				gamesPROA.push({
					home_team: teamNameListPROA[2*i+1], 
					away_team: teamNameListPROA[2*i], 
					home_odd: oddsListPROA[2*i+1], 
					away_odd: oddsListPROA[2*i],
					time: timeOddsPicking,
				})
		}
		console.log(gamesPROA);
	}

	var endTime = new Date().getTime();
	console.log('It took ' + (endTime - startTime) + ' to retrieve these odds'); 
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

