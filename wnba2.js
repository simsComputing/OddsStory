var fs = require("fs");
var process = require("process");
var Datastore = require('nedb'); 
var pinnacleOdds = new Datastore({ filename: './data/wnba/pinnacleOdds.db', autoload: true });
var betclicOdds = new Datastore({ filename: './data/wnba/betclicOdds.db', autoload: true });
var winamaxOdds = new Datastore({filename: "./data/wnba/winamaxOdds.db", autoload: true});
var unibetOdds = new Datastore({ filename: './data/wnba/unibetOdds.db', autoload: true });
var bwinOdds = new Datastore({ filename: "./data/wnba/bwinOdds.db", autoload: true});

// NBA, betclic
module.exports = {
	pickOddsWNBAWinamax: function(){
		console.log("fuck it");
  		var fs = require("fs");
  		var start = new Date().getTime();
  		var Horseman = require('node-horseman');
  		var horseman = new Horseman();
  		fs.appendFile("log/wnba.log", "Retrieving nba games odds on Winamax\n", (err) => {
	
  		});
  		horseman
      			.userAgent('Chrome/54.0.2840.87')
      			.openTab('https://www.winamax.fr/paris-sportifs/sports/2/800000077')
      			.catch(function(err){
      			fs.appendFile("log/wnba.log", err + "\n", (err) => {

			}); 
		        return horseman.close(); 
	       })
  		.evaluate( function(selector1, selector2, selector3, selector4){
    			var games = [];
    			var ngames = $(selector2).length;
    			var time = new Date().getTime();  


    			if (typeof $(selector3) != "undefined") {
    				var ngames2 = $(selector3).length/2;
      				var time = new Date().getTime();
      				for (i = 0;i < ngames2; i++) {
        				games.push({
        			 		home_team: $(selector4)[i*2].innerText,
        				 	away_team: $(selector4)[i*2+1].innerText,
          					home_odd: $(selector3)[i*2].innerText,
          					away_odd: $(selector3)[i*2+1].innerText,
	  					time: time
        				});
      				}
    			}

    			var time = new Date().getTime();
    			for (i = 0; i < ngames; i++) {
      				games.push({
        				home_team: $(selector2)[i].innerText.split(" - ")[0],
        				away_team: $(selector2)[i].innerText.split(" - ")[1],
        				home_odd: $(selector1)[i*2].innerText,
        				away_odd: $(selector1)[i*2+1].innerText,
					time: time
      				});
    			}
    
        		return games;
      		}
        	,'.row-catalog span.odd-button-value', ".row-catalog a.match-title", ".row-live span.odd-button-value", ".row-live a.match-title")
      		.then(function(games){
        		fs.appendFile("log/wnba.log", 'Successfully retrieved odds on Winamax\n', (err) => {
		});
  		winamaxOdds.insert(games, function (err, newDoc) {
    
  		});
		var date_obj = new Date();
        	var end =  date_obj.getTime();
		var date = date_obj.getDate() + "/" + (date_obj.getMonth() + 1) + "/" + date_obj.getYear() + " - " + date_obj.getHours() + ":" + date_obj.getMinutes(); 
		var nb_odds = games.length;
        	fs.appendFile("log/wnba.log", "It took " + (end-start)/1000 + " seconds to retrieve " + nb_odds + " odds. Date : " + date + "\n");
        	return horseman.close();
      	});

},

pickOddsWNBABwin: function(){
  var fs = require("fs");
  var start = new Date().getTime();
  var Horseman = require('node-horseman');
  var horseman = new Horseman();
  fs.appendFile("log/wnba.log", "Retrieving nba games odds on Bwin...\n", (err) => {
	  
  });
  horseman
      .userAgent('Chrome/54.0.2840.87')
      .openTab('https://sports.bwin.fr/fr/sports/7/paris-sportifs/basket-ball#sportId=7')
      .catch(function(err){
        fs.appendFile("log/wnba.log", err + "\n", (err) => {
			
		}); 
        return horseman.close(); 
      })
	.evaluate( function(selector1){
		function bwinGetOddsFromTag(odds_tag) {
			var odds = [];
			var swap = "";
			for (var k = 0; k < odds_tag.length; k++) {
				swap = odds_tag[k].innerText.replace(/\n/gi, "");
				odds.push(swap.replace(/ /gi, ""));
			}
			return odds;
		}

		function bwinGetTeamsFromTag(teams_tag) {
			var game_name = teams_tag.innerText;
			var swap = "";
			var end = false;
			for (var i = 1; i < game_name.length; i++) {
				if (game_name[i] != "(" && !end) {
					swap += game_name[i-1];
				} else {
					end = true;
				}
			}
			var teams = swap.split(" chez ");
			return teams;
		}


		var games = [];
		var ngames = $(selector1).length;
		var time = new Date().getTime();	

		// Cette boucle parcourt le tableau 
		//entier avec TOUS les matchs de 
		//basket compris. Y compris ceux qui 
		//ne sont pas des matchs NBA.
		for (var i = 0; i < ngames; i++) {  


			// On ne s'arrête que si on trouve
			//la ligne <tr> qui annonce les 
			//matchs NBA
			if ($(selector1)[i].innerText.search("WNBA") != -1) { 
				// Nouvelle boucle qui parcourt les matchs NBA 
				//et s'arrête à la prochaine ligne <tr> qui 
				//annonce une autre ligue (ligne sans className)
				for (var j = i+1; $(selector1)[j].className == "mg-event-row"; j++) {
					var odds = bwinGetOddsFromTag($(selector1)[j].getElementsByClassName("mg-option-button__option-odds"));	
					var teams = bwinGetTeamsFromTag($(selector1)[j].getElementsByClassName("js-mg-tooltip")[0]);
					var time = new Date().getTime();
					games.push({
						home_team: teams[1],
						away_team: teams[0],
						home_odd: odds[1],
						away_odd: odds[0],
						time: time
					});
				}
				return games;
			}
		}
      }
        ,'.mg-table > tbody > tr')
      .then(function(games){
	if (typeof games != "undefined") {
		bwinOdds.insert(games, function (err, newDoc) {

		});
	        fs.appendFile("log/wnba.log", 'Successfully retrieved odds on Bwin\n', (err) => {
			
		});
		
	        var date_obj = new Date();
	        var end =  date_obj.getTime();
			var date = date_obj.getDate() + "/" + (date_obj.getMonth() + 1) + "/" + date_obj.getYear() + " - " + date_obj.getHours() + ":" + date_obj.getMinutes(); 
		var nb_odds = games.length;
	        fs.appendFile("log/wnba.log", "It took " + (end-start)/1000 + " seconds to retrieve " + nb_odds + " odds. Date : " + date + "\n");
	        return horseman.close();
	} else {
		return horseman.close();
	}
      });

},

pickOddsWNBAPinnacle: function(){
   var fs = require("fs");
  var start = new Date().getTime();
  var Horseman = require('node-horseman');
  var horseman = new Horseman();
  fs.appendFile("log/wnba.log", "Retrieving nba games odds on Pinnacle...\n", (err) => {
	
  });
  horseman
      .userAgent('Chrome/54.0.2840.87')
      .openTab('https://www.pinnacle.com/fr/odds/match/basketball/usa/wnba?sport=True')
      .catch(function(err){
        fs.appendFile("log/wnba.log", err + "\n", (err) => {
		
	}); 
        return horseman.close(); 
      })
      .evaluate( function(selector1,selector2){
          var games = []; 
          var ngames = $(selector1).length/2;
          var time = new Date().getTime(); 
          for(i=0;i<ngames;i++){
            games.push({
              home_team: $(selector2)[(2*i+1).toString()].innerText, 
              away_team: $(selector2)[(2*i).toString()].innerText, 
              home_odd:$(selector1)[(2*i+1).toString()].innerText.split('\n')[0],
              away_odd:$(selector1)[(2*i).toString()].innerText.split("\n")[0],
              time: time, 
            });
          }
          return games;
      }
        ,'td.game-moneyline', 'td.game-name')
      .then(function(games){
        fs.appendFile("log/wnba.log", 'Successfully retrieved odds on Pinnacle\n', (err) => {
		
	});
        pinnacleOdds.insert(games, function (err, newDoc) {  

        });
	var date_obj = new Date();
        var end =  date_obj.getTime();
	var date = date_obj.getDate() + "/" + (date_obj.getMonth() + 1) + "/" + date_obj.getYear() + " - " + date_obj.getHours() + ":" + date_obj.getMinutes(); 
	var nb_odds = games.length;
        fs.appendFile("log/wnba.log", "It took " + (end-start)/1000 + " seconds to retrieve " + nb_odds + " odds. Date : " + date + "\n");
        return horseman.close();
      })
  }, 

pickOddsWNBABetclic: function(){
  var fs = require("fs");
  var start = new Date().getTime();
  var Horseman = require('node-horseman');
  var horseman = new Horseman();
  fs.appendFile("log/wnba.log", "Retrieving nba games odds on Betclic...\n", (err) => {
	
  });
  horseman
    .userAgent('Chrome/54.0.2840.87')
    .openTab('https://www.betclic.fr/basket-ball/wnba-e513')
    .catch(function(err){
        fs.appendFile("log/wnba.log", err + "\n", (err) => {
	
	}); 
        return horseman.close(); 
    })
    .waitForSelector('div.match-odds > div > span')
    .evaluate( function(selector1,selector2){
          var games = []; 
          var ngames = $(selector1).length;
          var time = new Date().getTime(); 
          for(i=0;i<ngames;i++){
            var strTitle = $(selector1)[i.toString()].innerText; 
            var splitDash = strTitle.split(" - ");
            var leftStr = splitDash[0]; 
            var rightStr = splitDash[1]; 
            games.push({
              //title: strTitle,
              home_team: leftStr, 
              away_team: rightStr, 
              home_odd:$(selector2)[(2*i).toString()].innerHTML,
              away_odd:$(selector2)[(2*i+1).toString()].innerHTML,
              time: time, 
            });
          }
          return  games;
      }
        ,'div.match-name > a', 'div.match-odds > div > span')
      .then(function(games){
        fs.appendFile("log/wnba.log", 'Successfully retrieved odds on Betclic: \n', (err) => {

	});
        betclicOdds.insert(games, function (err, newDoc) {  

        });
	var date_obj = new Date();
        var end =  date_obj.getTime();
	var date = date_obj.getDate() + "/" + (date_obj.getMonth() + 1) + "/" + date_obj.getYear() + " - " + date_obj.getHours() + ":" + date_obj.getMinutes(); 
	var nb_odds = games.length;
        fs.appendFile("log/wnba.log", "It took " + (end-start)/1000 + " seconds to retrieve " + nb_odds + " odds. Date : " + date + "\n");
        return horseman.close(); 
      })
  }, 

pickOddsWNBAUnibet: function(){
  var fs = require("fs");
  var start = new Date().getTime();
  var Horseman = require('node-horseman');
  var horseman = new Horseman();
  fs.appendFile("log/wnba.log", "Retrieving nba games odds on Unibet...\n", (err) => {
 
  });
  horseman
    .userAgent('Chrome/54.0.2840.87')
    .openTab('https://www.unibet.fr/sport/basketball/wnba')
    .catch(function(err){
        fs.appendFile("log/wnba.log", err + "\n", (err) => {

	}); 
        return horseman.close(); 
    })
    .evaluate( function(selector1,selector2){
          var games = []; 
          var ngames = $(selector1).length;
          var time = new Date().getTime(); 
          for(i=0;i<ngames;i++){
            var strTitle = $(selector1)[i.toString()].innerText; 
            var splitDash = strTitle.split(" - ");
            var leftStr = splitDash[0]; 
            var rightStr = splitDash[1]; 
            games.push({
              //title: strTitle,
              home_team: leftStr, 
              away_team: rightStr, 
              home_odd:$(selector2)[(2*i).toString()].innerHTML,
              away_odd:$(selector2)[(2*i+1).toString()].innerHTML,
              time: time, 
            });
          }
          return  games;
      }
        ,'div.cell-event > a', 'div.ui-touchlink-needsclick.clearfix.oddsbox.had-market.inline-market.layout-2 > span > span > span.ui-touchlink-needsclick.price')
      .then(function(games){
        fs.appendFile("log/wnba.log", 'Successfully retrieved odds on Unibet: \n', (err) => {

	});
        unibetOdds.insert(games, function (err, newDoc) {  

        });
	var date_obj = new Date();
        var end =  date_obj.getTime();
	var date = date_obj.getDate() + "/" + (date_obj.getMonth() + 1) + "/" + date_obj.getYear() + " - " + date_obj.getHours() + ":" + date_obj.getMinutes(); 
	var nb_odds = games.length;
        fs.appendFile("log/wnba.log", "It took " + (end-start)/1000 + " seconds to retrieve " + nb_odds + " odds. Date : " + date + "\n");
        return horseman.close(); 
      })
  } 
}

