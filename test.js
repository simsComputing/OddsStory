var Datastore = require('nedb'); 
var PMUOdds = new Datastore({ filename: './data/pmuOdds.db', autoload: true });
var betclicOdds = new Datastore({ filename: './data/betclicOdds.db', autoload: true });
var unibetOdds = new Datastore({ filename: './data/unibetOdds.db', autoload: true });
var pinnacleOdds = new Datastore({ filename: './data/pinnacleOdds.db', autoload: true });
var testhtml = new Datastore({ filename: './data/testhtml.db', autoload: true });


pickOddsPMU = function(){
  var start = new Date().getTime();
  var Horseman = require('node-horseman');
  var horseman = new Horseman({
        injectJquery: true
    });
  console.log("Retrieving nba games odds on PMU...")
  horseman
    //.userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36')
    .userAgent('Chrome/54.0.2840.87')
    //.userAgent('Safari/537.36')
    .viewport(1920,1080)
    .openTab('https://paris-sportifs.pmu.fr/pari/competition/3502/basket-us/nba-matchs')
    //.openTab('https://paris-sportifs.pmu.fr/pari/competition/308/football/italie-série')
    //.openTab('https://paris-sportifs.pmu.fr/pari/competition/759/tennis/roland-garros-h')
    .catch(function(err){
        console.log(err); 
        return horseman.close(); 
    })
    // .screenshot('/home/alexgoup/Coding/OddsStory/data/sc.png')
    .waitForSelector('em.trow--event--name')
    //.waitForSelector('a.hierarchy-outcome-price.add-selection-to-betslip.btn.btn-odds.tc-track-element-events.add-selection-to-betslip-processed')
    .evaluate( function(selector1,selector2){
          var games = []; 
          var titleElements = document.querySelectorAll(selector1);
          var oddsElements = document.querySelectorAll(selector2);
          var ngames = titleElements.length;
          var time = new Date().getTime(); 
	          for(i=0;i<ngames;i++){
	            var strTitle = titleElements[i.toString()].innerText; 
	            var splitDash = strTitle.split(" // ");
	            var leftStr = splitDash[0]; 
	            var rightStr = splitDash[1]; 
	            games.push({
	              //title: strTitle,
	              home_team: leftStr, 
	              away_team: rightStr, 
	              home_odd:oddsElements[(2*i).toString()].innerText,
	              away_odd:oddsElements[(2*i+1).toString()].innerText,
	              time: time, 
	            });
	          }
          return  games;
      }
       ,'em.trow--event--name','a.hierarchy-outcome-price.add-selection-to-betslip.btn.btn-odds.tc-track-element-events.add-selection-to-betslip-processed')
     //.html('em.trow--event--name > span')
     //.html('a.hierarchy-outcome-price.add-selection-to-betslip.btn.btn-odds.tc-track-element-events.add-selection-to-betslip-processed')
     .then(function(games){
        console.log('Successfully retrieved odds on PMU:');
        console.log(games);
        // testhtml.insert(games, function (err, newDoc) {  

        // });
        var end = new Date().getTime();
        console.log("It took " + (end-start)/1000 + " seconds to retrieve these odds.");
        return horseman.close(); 
      })
  }; 

  pickOddsPinnacle = function(){
  var start = new Date().getTime();
  var Horseman = require('node-horseman');
  var horseman = new Horseman();
  console.log("Retrieving nba games odds on Pinnacle...")
  horseman
      .userAgent('Chrome/54.0.2840.87')
      .openTab('https://www.pinnacle.com/fr/odds/match/basketball/usa/nba?sport=True')
      .catch(function(err){
        console.log(err); 
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
          return $;
      }
        ,'td.game-moneyline', 'td.game-name')
      .then(function(games){
        console.log('Successfully retrieved odds on Pinnacle:');
        console.log(games);
        // pinnacleOdds.insert(games, function (err, newDoc) {  

        // });
        var end = new Date().getTime();
        console.log("It took " + (end-start)/1000 + " seconds to retrieve these odds.");
        return horseman.close();
      })
  }; 

  pickOddsBetclic = function(){
  var start = new Date().getTime();
  var Horseman = require('node-horseman');
  var horseman = new Horseman();
  console.log("Retrieving nba games odds on Betclic...")
  horseman
    .userAgent('Chrome/54.0.2840.87')
    .openTab('https://www.betclic.fr/basket-ball/nba-e13')
    .catch(function(err){
        console.log(err); 
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
        console.log('Successfully retrieved odds on Betclic:');
        console.log(games);
        betclicOdds.insert(games, function (err, newDoc) {  

        });
        var end = new Date().getTime();
        console.log("It took " + (end-start)/1000 + " seconds to retrieve these odds.");
        return horseman.close(); 
      })
  }; 

  pickOddsUnibet = function(){
  var start = new Date().getTime();
  var Horseman = require('node-horseman');
  var horseman = new Horseman();
  console.log("Retrieving nba games odds on Unibet...")
  horseman
    .userAgent('Chrome/54.0.2840.87')
    .openTab('https://www.unibet.fr/sport/basketball/nba')
    .catch(function(err){
        console.log(err); 
        return horseman.close(); 
    })
    .evaluate( function(selector1,selector2){
          var games = []; 
          var ngames = $(selector1).length;
          //var ngames = $(selector2);
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
        console.log('Successfully retrieved odds on Unibet:');
        console.log(games);
        unibetOdds.insert(games, function (err, newDoc) {  

        });
        var end = new Date().getTime();
        console.log("It took " + (end-start)/1000 + " seconds to retrieve these odds.");
        return horseman.close(); 
      })
  };

function repeat(){
    pickOddsPinnacle(); 
    pickOddsBetclic(); 
    pickOddsUnibet();
    setTimeout(repeat, 60000);
}

pickOddsPMU();
