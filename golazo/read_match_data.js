let config= require("./config");

function barcagoals(match){
   let goals;
   if(match['homeTeam']['id']===config.team){
      goals=match['score']['fullTime']['home'];
   }
   else{
      goals=match['score']['fullTime']['away'];
   }
   return goals || 0;
}

function scoreAnnouncement(match){
   let home= match['homeTeam']['shortName'] || match['homeTeam']['name'];
   let away= match['awayTeam']['shortName'] || match['awayTeam']['name'];
   let score= match['score']['fullTime'];
   return home + " "+(score['home']||0)+ "-" + (score['away']||0)+" " +away; 
}

function matchOnNow(matches){
   return matches.find(function(match){
      //halftime
      return match['status']==='IN_PLAY' || match['status']==='PAUSED';
   });
}

function nextMatch(matches){
   let upcomingmatch=matches.filter(function(match){
      return match['status']==='SCHEDULED'||match['status']==='TIMED';
   });
   upcomingmatch.sort(function(firstMatch, secondMatch){
      return new Date(firstMatch['utcDate'])-new Date(secondMatch['utcDate']);
   });
   return upcoming[0]
}

module.exports={barcagoals, scoreAnnouncement, matchOnNow, nextMatch}


