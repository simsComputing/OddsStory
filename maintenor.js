var Datastore = require('nedb'); 

module.exports = {
	'pinnacle' : {
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = oddListTab.length/2; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[2*i+1]; 
					var awayteamName = teamNameListTab[2*i]; 
					var homeOdd = oddListTab[2*i+1]; 
					var awayOdd = oddListTab[2*i];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = oddListTab.length/3; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[3*i];
					var awayteamName = teamNameListTab[3*i+1];
					var homeOdd = oddListTab[3*i]; 
					var awayOdd = oddListTab[3*i+1]; 
					var drawOdd = oddListTab[3*i+2];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		//Selectors Strings for Pinnacle
		selectors: {
			moneyline: {
				name:"td.game-moneyline",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].split("\n")[0]);
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "td.game-name",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/pinnacle.db', autoload: true }),
		name : "pinnacle",
		containsJQuery: true,
		selectorTimeout: 55000, 		
	},
	'betclic':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" - ")[0]; 
					var awayteamName = teamNameListTab[i].split(" - ")[1]; 
					var homeOdd = oddListTab[2*i]; 
					var awayOdd = oddListTab[2*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" - ")[0]; 
					var awayteamName = teamNameListTab[i].split(" - ")[1]; 
					var homeOdd = oddListTab[3*i]; 
					var awayOdd = oddListTab[3*i+2];
					var drawOdd = oddListTab[3*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		selectors: {
			moneyline: {
				name:"div.match-odds > div > span",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].replace(',','.'));
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "div.match-name",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/betclic.db', autoload: true }),
		name : "betclic",
		containsJQuery: true,
		selectorTimeout: 55000, 			
	},
	'winamax':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var indEndLive = 0; 
				while(teamNameListTab[indEndLive].indexOf(' - ') == -1){
					indEndLive++; 
				}
				var indStartSpecialBets = teamNameListTab.length-1; 
				while(teamNameListTab[indStartSpecialBets].indexOf(' - ') == -1){
					indStartSpecialBets--; 
				}
				var ngamesLive = indEndLive/2; 	
				for (var i=indEndLive; i<=indStartSpecialBets; i++){
					var hometeamName = teamNameListTab[i].split(" - ")[0]; 
					var awayteamName = teamNameListTab[i].split(" - ")[1]; 
					var homeOdd = oddListTab[2*(i-ngamesLive)]; 
					var awayOdd = oddListTab[2*(i-ngamesLive)+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var indEndLive = 0; 
				while(teamNameListTab[indEndLive].indexOf(' - ') == -1){
					indEndLive++; 
				}
				var indStartSpecialBets = teamNameListTab.length-1; 
				while(teamNameListTab[indStartSpecialBets].indexOf(' - ') == -1){
					indStartSpecialBets--; 
				}
				var ngamesLive = indEndLive/2; 				
				for (var i=indEndLive; i<=indStartSpecialBets; i++){
					var hometeamName = teamNameListTab[i].split(" - ")[0]; 
					var awayteamName = teamNameListTab[i].split(" - ")[1]; 
					var homeOdd = oddListTab[3*(i-ngamesLive)]; 
					var awayOdd = oddListTab[3*(i-ngamesLive)+2];
					var drawOdd = oddListTab[3*(i-ngamesLive)+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},
		selectors: {
			moneyline: {
				name:"button.odd-button > span",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].replace(',','.'));
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "a.match-title",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/winamax.db', autoload: true }),
		name : "winamax",
		containsJQuery: true,
		selectorTimeout: 55000, 
	},
	'unibet':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" - ")[0]; 
					var awayteamName = teamNameListTab[i].split(" - ")[1]; 
					var homeOdd = oddListTab[2*i]; 
					var awayOdd = oddListTab[2*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" - ")[0]; 
					var awayteamName = teamNameListTab[i].split(" - ")[1]; 
					var homeOdd = oddListTab[3*i]; 
					var awayOdd = oddListTab[3*i+2];
					var drawOdd = oddListTab[3*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		selectors: {
			moneyline: {
				name:"span.ui-touchlink-needsclick.price.odd-price",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "div.cell-event > a",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/unibet.db', autoload: true }),
		name : "unibet",	
		containsJQuery: true,
		selectorTimeout: 55000,  
	},
	'pmu':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" // ")[0]; 
					var awayteamName = teamNameListTab[i].split(" // ")[1]; 
					var homeOdd = oddListTab[2*i]; 
					var awayOdd = oddListTab[2*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" // ")[0]; 
					var awayteamName = teamNameListTab[i].split(" // ")[1]; 
					var homeOdd = oddListTab[3*i];  
					var awayOdd = oddListTab[3*i+2]; 
					var drawOdd = oddListTab[3*i+1]; 
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		selectors: {
			moneyline: {
				name:"a.hierarchy-outcome-price.add-selection-to-betslip.btn.btn-odds.tc-track-element-events.add-selection-to-betslip-processed",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].replace(',','.'));
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "em.trow--event--name > span",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		},
		db : new Datastore({ filename: './data/pmu.db', autoload: true }),
		name : "pmu",
		containsJQuery: false,	
		selectorTimeout: 55000, 	
	},
	'bwin':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = oddListTab.length/2; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[2*i+1]; 
					var awayteamName = teamNameListTab[2*i]; 
					var homeOdd = oddListTab[2*i+1]; 
					var awayOdd = oddListTab[2*i];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = oddListTab.length/3; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[3*i];
					var awayteamName = teamNameListTab[3*i+2];
					var homeOdd = oddListTab[3*i]; 
					var awayOdd = oddListTab[3*i+2]; 
					var drawOdd = oddListTab[3*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		selectors: {
			moneyline: {
				name:"div.mb-option-button__option-odds",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "div.mb-option-button__option-name",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/bwin.db', autoload: true }),
		name : "bwin",	
		containsJQuery: true,
		selectorTimeout: 55000, 
	},
	'netbet':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" / ")[0]; 
					var awayteamName = teamNameListTab[i].split(" / ")[1]; 
					var homeOdd = oddListTab[2*i]; 
					var awayOdd = oddListTab[2*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" / ")[0]; 
					var awayteamName = teamNameListTab[i].split(" / ")[1]; 
					var homeOdd = oddListTab[3*i];  
					var awayOdd = oddListTab[3*i+2]; 
					var drawOdd = oddListTab[3*i+1]; 
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		selectors: {
			moneyline: {
				name:"div.odd-without-actor > a",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].replace(',','.'));
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "div.bet-libEvent.uk-text-truncate.uk-flex",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].split('\n')[0]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/netbet.db', autoload: true }),
		name : "netbet",	
		containsJQuery: true,
		selectorTimeout: 55000, 
	},
	'fdj':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" / ")[0]; 
					var awayteamName = teamNameListTab[i].split(" / ")[1]; 
					var homeOdd = oddListTab[2*i]; 
					var awayOdd = oddListTab[2*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" - ")[0]; 
					var awayteamName = teamNameListTab[i].split(" - ")[1]; 
					var homeOdd = oddListTab[3*i];  
					var awayOdd = oddListTab[3*i+2]; 
					var drawOdd = oddListTab[3*i+1]; 
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		selectors: {
			moneyline: {
				name:"li.odds > ul > li",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].replace(',','.'));
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "li.outcomes.inline-market",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].split('\n')[0]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/fdj.db', autoload: true }),
		name : "fdj",	
		containsJQuery: true,
		selectorTimeout: 55000, 		
	},
	'francepari':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" / ")[0]; 
					var awayteamName = teamNameListTab[i].split(" / ")[1]; 
					var homeOdd = oddListTab[2*i]; 
					var awayOdd = oddListTab[2*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" / ")[0]; 
					var awayteamName = teamNameListTab[i].split(" / ")[1]; 
					var homeOdd = oddListTab[3*i] 
					var awayOdd = oddListTab[3*i+2]; 
					var drawOdd = oddListTab[3*i+1]; 
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		selectors: {
			moneyline: {
				name:"div.odd-event.uk-grid span.odd",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i].replace(',','.'));
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "span.bet-libEvent",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/francepari.db', autoload: true }),
		name : "francepari",	
		containsJQuery: true,
		selectorTimeout: 55000, 			
	},
	'bet365':{
		createGameTwoOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
			var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" / ")[0]; 
					var awayteamName = teamNameListTab[i].split(" / ")[1]; 
					var homeOdd = oddListTab[2*i]; 
					var awayOdd = oddListTab[2*i+1];
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			}
			return games;

		},

		createGameThreeOutcomes: function(games,selectorsData,leagueName,bookieName,timeOddsPicking){
			var oddListTab = selectorsData['moneyline']; 
			var teamNameListTab = selectorsData['teamname'];
			if(oddListTab != undefined && teamNameListTab != undefined){
				var ngames = teamNameListTab.length; 
				for (var i=0; i<ngames; i++){
					var hometeamName = teamNameListTab[i].split(" / ")[0]; 
					var awayteamName = teamNameListTab[i].split(" / ")[1]; 
					var homeOdd = oddListTab[3*i] 
					var awayOdd = oddListTab[3*i+2]; 
					var drawOdd = oddListTab[3*i+1]; 
					if(!isNaN(homeOdd) && !isNaN(awayOdd)){
						games.push({
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
			return games; 
		},

		selectors: {
			moneyline: {
				name:"div.sl-CouponParticipantCenteredDarker.gl-ParticipantCentered.gl-Participant_General.gl-ParticipantCentered_NoHandicap",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						var splits = sltrData.innerText[i].split('\n');
						if(sltrData.innerText[i].split('\n').length == 2){
							list.push(fractionalToDecimal(sltrData.innerText[i].split('\n')[0]));
						}
					}
					return list; 
				},
				dataname: 'moneyline', 
			},
			teamname: {
				name: "div.sl-CouponParticipantGameLineTwoWay_NameText",
				fn: function(sltrData){
					var list = []; 
					for(var i=0; i<sltrData.innerText.length; i++){
						list.push(sltrData.innerText[i]);
					}
					return list; 
				},
				dataname: 'teamname', 
			},
		}, 
		db : new Datastore({ filename: './data/bet365.db', autoload: true }),
		name : "bet365",	
		containsJQuery: false,			
	},
}

fractionalToDecimal = function(str){
	var strs = str.split('/');
	return (Number(strs[0])/Number(strs[1]) + 1).toString();  

}