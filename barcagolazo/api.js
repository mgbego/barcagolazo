const config=require("./config");

function formatDate(date){
   return date.toISOString().slice(0,10);
}

function pieceurl(){
   let now=Date.now()
   const oneday= 24*60*60*1000 //one day in ms
   let from= formatDate(new Date(now-oneday));
   let to= formatDate(new Date(now+oneday));
   return "https://api.football-data.org/v4/teams/"+config.team+"/matches?dateFrom="+from+"&dateTo="+to;
}

function getmatches(){
   return fetch(pieceurl(), {headers: {"X-Auth-Token":config.key}}).then(function(response){
      if(response.status===429){
         throw new Error("rate limit exceeded (429)");
      }
      if (!response.ok){
         throw new Error("http "+response.status);
      }
      return response.json();
   })
   .then(function(jsondata){
      //|| so that you at lease get an empty list rather than undef
      return jsondata['matches'] || [];
   });
}

module.exports={getmatches}

