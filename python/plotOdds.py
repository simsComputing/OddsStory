from __future__ import division
import matplotlib.pyplot as plt
import matplotlib.dates as md
import json 
import time
import math
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-t", "--hometeam", dest="hometeam", help="parser for home team. should be written within quotation marks")
parser.add_option("-a", "--awayteam", dest="awayteam", help="parser for away team. should be written within quotation marks")

(opts, args) = parser.parse_args()

if opts.hometeam is None or opts.awayteam is None:
    print ("A mandatory option is missing\n")
    parser.print_help()
    exit(-1)

awayOdds1 = []
homeOdds1 = []
timeOdds1 = []
timeOddsStr1 = []

awayOdds2 = []
homeOdds2 = []
timeOdds2 = []
timeOddsStr2 = []

awayOdds3 = []
homeOdds3 = []
timeOdds3 = []
timeOddsStr3 = []

awayOdds4 = []
homeOdds4 = []
timeOdds4 = []
timeOddsStr4 = []

awayOdds5 = []
homeOdds5 = []
timeOdds5 = []
timeOddsStr5 = []


def isGameValid(game):
    if game["home_team"] == opts.hometeam and game["away_team"] == opts.awayteam and game["away_odd"] != "" and game["home_odd"] != "" and game["home_odd"] != "hors ligne" and game["away_odd"] != "hors ligne":
	return True
    else:
	return False

for line in open('./pinnacleOdds.db','r').readlines():
    game = json.loads(line)
    if isGameValid(game):
    	awayOdds1.append(100/float(game["away_odd"]))
    	homeOdds1.append(100/float(game["home_odd"]))
    	timeOddsStr1.append(time.asctime(time.gmtime(math.floor(game["time"]/1000))))
    	timeOdds1.append(game["time"])
    	homeTeam = game["home_team"]
    	awayTeam = game["away_team"]
    	

for line in open('./betclicOdds.db','r').readlines():
    game = json.loads(line)
    if isGameValid(game):
    	awayOdds2.append(100/float(game["away_odd"].replace(",", ".")))
    	homeOdds2.append(100/float(game["home_odd"].replace(",", ".")))
    	timeOddsStr2.append(time.asctime(time.gmtime(math.floor(game["time"]/1000))))
    	timeOdds2.append(game["time"])

for line in open('./unibetOdds.db','r').readlines():
    game = json.loads(line)
    if isGameValid(game):
    	awayOdds3.append(100/float(game["away_odd"].replace(",", ".")))
    	homeOdds3.append(100/float(game["home_odd"].replace(",", ".")))
    	timeOddsStr3.append(time.asctime(time.gmtime(math.floor(game["time"]/1000))))
    	timeOdds3.append(game["time"])

for line in open('./winamaxOdds.db','r').readlines():
    game = json.loads(line)
    if isGameValid(game):
    	awayOdds4.append(100/float(game["away_odd"].replace(",", ".")))
    	homeOdds4.append(100/float(game["home_odd"].replace(",", ".")))
    	timeOddsStr4.append(time.asctime(time.gmtime(math.floor(game["time"]/1000))))
    	timeOdds4.append(game["time"])
'''
for line in open('./bwinOdds.db','r').readlines():
    game = json.loads(line)
    if isGameValid(game):
    	awayOdds5.append(100/float(game["away_odd"].replace(",", ".")))
    	homeOdds5.append(100/float(game["home_odd"].replace(",", ".")))
    	timeOddsStr5.append(time.asctime(time.gmtime(math.floor(game["time"]/1000))))
    	timeOdds5.append(game["time"])
'''

plt.scatter(timeOdds1,homeOdds1,label=homeTeam + " Pinnacle")
plt.scatter(timeOdds1,awayOdds1,label=awayTeam + " Pinnacle")
plt.scatter(timeOdds2,homeOdds2,label=homeTeam + " Betclic")
plt.scatter(timeOdds2,awayOdds2,label=awayTeam + " Betclic")
plt.scatter(timeOdds3,homeOdds3,label=homeTeam + " Unibet")
plt.scatter(timeOdds3,awayOdds3,label=awayTeam + " Unibet")
plt.scatter(timeOdds4,homeOdds4,label=homeTeam + " Winamax")
plt.scatter(timeOdds4,awayOdds4,label=awayTeam + " Winamax")
plt.scatter(timeOdds5,homeOdds5,label=homeTeam + " Bwin")
plt.scatter(timeOdds5,awayOdds5,label=awayTeam + " Bwin")
plt.xticks(timeOdds1,timeOddsStr1,rotation=80,fontsize=6)
plt.ylabel('Likelihood of winning (1/odd)')
plt.legend(bbox_to_anchor=(0, 1.125), loc=2, borderaxespad=0.)

plt.show()
