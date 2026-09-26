let config=require("./config");
let api=require("./api");
let match=require("./read_match_data");
let celebrate=require("./celebration_effect").celebrate;


let seen={};
let lastPrinted=null;

function printTime(message){
   console.log("["+new Date().toLocaleTimeString()+"] "+message);
}

function goalComparison(liveMatch){
   let goals=match.barcagoals(liveMatch);
   let prev_goal=seen[liveMatch['id']];
   seen[liveMatch['id']]=goals;
   if(prev_goal===undefined){
      printTime("match is live: "+match.scoreline(liveMatch));
   }
   else if(goals>prev_goal){
      return celebrate(match.scoreline(liveMatch)).then(function(){
         printTime("GOAL! "+match.scoreline(liveMatch));
      });
   }
   else if(goals<prev_goal){
      printTime("goal taken back (VAR?): "+match.scoreline(liveMatch));
   }
   return Promise.resolve();
}

//no match live right now find next (only relevant for UCL I guess)
function nextCheck(nextMatch){
   if(!nextMatch){
      if(lastPrinted!=="none"){
         printTime("no Barça match in the next day, checking every hour");
         lastPrinted="none";
      }
      return config.nonewait;
   }
   if(lastPrinted!==nextMatch['id']){
      printTime("next: "+nextMatch['homeTeam']['name']+" vs "+nextMatch['awayTeam']['name']+", "+new Date(nextMatch['utcDate']).toLocaleString());
      lastPrinted=nextMatch['id'];
   }
   let timeToWait=new Date(nextMatch['utcDate'])-Date.now();
   return Math.min(config.soonwait, Math.max(config.livewait, timeToWait));
}

function api_check(){
   api.getmatches()
      .then(function(matches){
         let liveMatch=match.findlive(matches);
         if(liveMatch){
            return goalComparison(liveMatch).then(function(){
               return config.livewait;
            });
         }
         return nextCheck(match.findnext(matches));
      })
      .catch(function(err){
         printTime("[ERROR]: "+err.message+", trying again in a minute");
         return config.errorwait;
      })
      .then(function(wait){
         setTimeout(api_check, wait);
      });
}

process.on("SIGINT", function(){
   process.stdout.write(config.colours.reset+"\n");
   process.exit(0);
});

//debug
if(process.argv.includes("--test")){
   celebrate("Barça 1-0 Test FC");
}
//need a free key from football-data.org
else if(!config.key){
   console.error("set FOOTBALL_DATA_KEY first");
   process.exit(1);
}
else{
   printTime("watching for Barça goals... (press ctrl+c to stop)");
   api_check();
}

