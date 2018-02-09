var consts = require("./consts.js");

module.exports = {
	pickOdds: function(URLs,bookmaker){
		var Horseman = require("node-horseman");

		//Horseman object with options
		var horseman = new Horseman({
			ignoreSSLErrors: true, 
			loadImages: false, 
			timeout: bookmaker.selectorTimeout === undefined ? 5000 : bookmaker.selectorTimeout, 
		});

		//UserAgent String
		var strUserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"; 

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

		var dataFromSelectors = []; 
		for (var i=0; i<nTabs; i++){
			dataFromSelectors[i] = {};
		}

		var selectorKeys = Object.keys(bookmaker.selectors);
		var nSelectors = selectorKeys.length;

		horseman
		.userAgent(strUserAgent)
		.viewport(1920,1080);

		function startHorseman(horseman, url, tabNB){
			console.log('Opening URL ' + url + ' with bookmaker ' 	+ bookmaker.name); 
			horseman
			.openTab(url).status().then((sta) => {
				if (sta != 200) {
					console.log('Wrong status!'); 
				}
			})
			.do(function(){
				var sltr = bookmaker.selectors[selectorKeys[selectors_tested[tabNB]]]; 
				startSelectorAnalysis(horseman,sltr,tabNB); 
  			})
			.catch(function(err){
				console.log("Got into error catcher : " + err); 
				saveOdds(); 
				tryWithNewInstance(); 
				return horseman.close(); 
			})

		}

		function loop(){

			horseman = new Horseman({
				ignoreSSLErrors: true, 
				loadImages: false, 
				timeout: 15000, 
			});
			var dataFromSelectors = []; 
			for (var i=0; i<nTabs; i++){
				dataFromSelectors[i] = {};
			}
			selectors_tested = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0); 
			arrayMapper = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0); 
			for(var i=0; i<nTabs; i++){
				arrayMapper[i] = i+1; 
			}
			tabCompleted = 0; 
			currentTab = 0; 
			startTime = new Date().getTime();
			startHorseman(horseman,URLs[currentTab][0],currentTab); 
		}

		//main 
		var currentTab = 0; 
		startHorseman(horseman,URLs[currentTab][0],currentTab); 

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
			var dataFromSelectors = []; 
			for (var i=0; i<nTabs; i++){
				dataFromSelectors[i] = {};
			}
			selectors_tested = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0); 
			arrayMapper = Array.apply(null, Array(nTabs)).map(Number.prototype.valueOf,0); 
			for(var i=0; i<nTabs; i++){
				arrayMapper[i] = i+1; 
			}
			tabCompleted = 0; 
			currentTab = 0; 
			startTime = new Date().getTime();
			startHorseman(horsemanRetry,URLs[currentTab][0],currentTab); 

		}
		//Checks whether all the URL selectors have been processed. If so, closes the tab and opens the following URL.
		//Then, checks whether all the tabs have been processed. If so, saves the odds and closes the horseman instance. 
		function onSelectorProcessed(horseman,numTab) {

			selectors_tested[numTab]++;
			console.log("Selector completed! vect is now " + selectors_tested); 
			if (selectors_tested[numTab] == nSelectors) {
				console.log('Finished tab number ' + numTab); 
				shiftTabsNumber(numTab); 
				console.log('Arraymapper is now ' + arrayMapper);
				tabCompleted++; 
				currentTab++; 
				if(currentTab < nTabs){
					horseman.closeTab(arrayMapper[numTab]); 
					startHorseman(horseman,URLs[currentTab][0],currentTab); 				
			}
				if(tabCompleted == nTabs){
					console.log('Closing horseman object and saving odds into DB...');
					saveOdds();  
					return horseman.close();
				}
			}
			else{
				startSelectorAnalysis(horseman,bookmaker.selectors[selectorKeys[selectors_tested[numTab]]],numTab);
			}

		}

		function startSelectorAnalysis(horseman,sltr,tabNB){
			horseman
			.waitForSelector(sltr.name)
			.catch(function(err){
				console.log("Got into error catcher : " + err); 
			})
			.exists(sltr.name).then((bool) => {
				if (bool) {
					console.log("Evaluating " + sltr.name + " selector...");
					horseman //PMU : do (function(){evaluateNoJQUERY(selector)})??? + options horseman si elles existent 
					.do(function(){
						if(bookmaker.containsJQuery){
							evaluateJQuery(horseman,sltr,tabNB); 
						}
						else{
							evaluateNoJQuery(horseman,sltr,tabNB);
						}
					})
				}
				else{
					console.log('Moneyline selector does not exist.');
					dataFromSelectors[tabNB][sltr.name] = []; 
					return onSelectorProcessed(horseman,tabNB); 
				}            
			}) 
		}

		function evaluateJQuery(horseman,sltr,tabNB){
			horseman.evaluate(function(selector){
				var sltrData = {
					innerText: [], 
					//ADD OTHER PROPERTIES IF NEEDED HERE AND COMPLETE PUSH BELOW
				};
				var nElements = $(selector).length; 
				for(var i=0; i<nElements; i++){
					sltrData.innerText.push($(selector)[(i).toString()].innerText); 
				}
				return sltrData; 
			},sltr.name)
			.then((sltrData) => {
				timeOddsPicking = new Date().getTime();
				dataFromSelectors[tabNB][sltr.dataname] = sltr.fn(sltrData); 
				return onSelectorProcessed(horseman,tabNB);
			})			
		}		

		function evaluateNoJQuery(horseman,sltr,tabNB){
			horseman.evaluate(function(selector){
				var sltrData = {
					innerText: [], 
					//ADD OTHER PROPERTIES IF NEEDED HERE AND COMPLETE PUSH BELOW
				};
				var nElements = document.querySelectorAll(selector).length; 
				for(var i=0; i<nElements; i++){
					sltrData.innerText.push(document.querySelectorAll(selector)[(i).toString()].innerText); 
				}
				return sltrData; 
			},sltr.name)
			.then((sltrData) => { 
				timeOddsPicking = new Date().getTime();
				dataFromSelectors[tabNB][sltr.dataname] = sltr.fn(sltrData); 
				return onSelectorProcessed(horseman,tabNB);
			})			
		}

		//Handles the horseman tabs number when closing a tab.  
		function shiftTabsNumber(numTab){

			for(var i=numTab+1; i<nTabs;i++ ){
				arrayMapper[i]--; 
			}

		}

		//The following functions are used to process the lists retrieved from the selectors and save the team names and odds into the DB. 
		function saveOdds() {
			games = []; 
			for (var j=0; j<nTabs; j++){
				var selectorsData = dataFromSelectors[j]; 
				var bookieName = bookmaker.name;
				var leagueName = URLs[j][1]; 
				if(consts.threeOutcomes.indexOf(leagueName) > -1){
					games = bookmaker.createGameThreeOutcomes(games,selectorsData,leagueName,bookieName,timeOddsPicking); 
				}
				else if(consts.twoOutcomes.indexOf(leagueName) > -1){
					games = bookmaker.createGameTwoOutcomes(games,selectorsData,leagueName,bookieName,timeOddsPicking); 		
				}
			}
	  		bookmaker.db.insert(games, function (err, newDoc){});
			console.log(games);
			var endTime = new Date().getTime();
			console.log('It took ' + (endTime - startTime) + ' to retrieve these odds'); 
			// Relaunch bookmaker
			if((endTime - startTime)<30000){
				console.log("Waiting " + (30000 - endTime + startTime) + " milliseconds..." );
				setTimeout(function(){ 
				        loop(); 
				    }, (30000 - endTime + startTime));
			}
			else{
				loop(); 
			}
		}

		//Function to wait for <ms> milliseconds before executing next line of code. 
		function wait(ms){
		   var start = new Date().getTime();
		   var end = start;
		   while(end < start + ms) {
		     end = new Date().getTime();
		  }
		}

		function sleep(ms) {
  			return new Promise(resolve => setTimeout(resolve, ms));
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
	}
}
