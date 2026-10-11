let {execFile}=require("child_process");
let {promisify}=require("util");
let fs=require("fs");
let os=require("os");
let path=require("path");

let run=promisify(execFile);

//how often to check on spotify and how many times before giving up 
let checkwait=250;
let maxchecks=40;
//10s total 

//play a builtin mac sound if possible otherwise normal bell
function terminalBell(){
   if(process.platform==="darwin"){
      run("afplay", ["/System/Library/Sounds/Hero.aiff"]).catch(function(){
         process.stdout.write("\x07");
      });
      return;
   }
   process.stdout.write("\x07");
}

function wait(waittime){
   return new Promise(function(resolve){
      setTimeout(resolve, waittime);
   });
}

function spotUri(link){
   if(link.startsWith("spotify:track")){
      return link;
   }
   let song_id=link.split("/track/")[1].split("?")[0];
   return "spotify:track:"+song_id;
}

function spotInstalledMac(){
   let locations=[
      "/Applications/Spotify.app",
      path.join(os.homedir(), "Applications", "Spotify.app")
   ];
   return locations.some(function(location){
      return fs.existsSync(location);
   });
}

async function applescript(script){
   let result=await run("osascript", ["-e", script]);
   return result.stdout.trim();
}

//the app at the front right now
async function frontApp(){
   return applescript('tell application "System Events" to get name of first process whose frontmost is true');
}

async function spotRunningMac(){
   return (await applescript('application "Spotify" is running'))==="true";
}

//open spotify in the background!!
async function startSpotMac(){
   if(await spotRunningMac()){
      return;
   }
   await run("open", ["-g", "-a", "Spotify"]);
   for(let tries=0; tries<maxchecks; ++tries){
      if(await spotRunningMac()){
         return;
      }
      await wait(checkwait);
   }
   throw new Error("spotify never started");
}

//put the app that was at the front back at the front 
async function bringAppFront(app){
   if(!app){
      return;
   }
   try{
      await applescript('tell application "System Events" to set frontmost of process "'+app.replace(/"/g, '\\"')+'" to true');
   }
   catch(err){
      //a focus problem shouldn't stop the song
   }
}

async function spotPlaying(){
   try{
      return (await applescript('tell application "Spotify" to return player state as string'))==="playing";
   }
   catch(err){
      return false; //spotify may still be loading the track
   }
}

async function waitUntilPlaying(){
   for(let tries=0; tries<maxchecks; ++tries){
      if(await spotPlaying()){
         return;
      }
      await wait(checkwait);
   }
   throw new Error("spotify never started playing");
}

//1 remember which app you're in (vs code or terminal)
//2 open spotify in the background and put your app back in front
//3 play the song and wait until it's actually playing
//4 jump to the start time (from the start)
async function playOnMac(song, stime){
   let front=await frontApp();
   await startSpotMac();
   await bringAppFront(front);
   await applescript('tell application "Spotify" to play track "'+song+'"');
   await waitUntilPlaying();
   await applescript('tell application "Spotify" to set player position to '+stime);
   await bringAppFront(front);
}

async function stopOnMac(){
   await applescript('tell application "Spotify" to pause');
}

async function playOnLinux(song, stime){
   await run("playerctl", ["--player=spotify", "open", song]);
   await wait(500);
   await run("playerctl", ["--player=spotify", "position", String(stime)]);
}

async function stopOnLinux(){
   await run("playerctl", ["--player=spotify", "pause"]);
}

//windows tbd

//gives back a function that stops the song or null if it couldn't play (the bell rings instead)
async function startSong(link, start){
   let player=null;
   if(process.platform==="darwin" && spotInstalledMac()){
      player={play:playOnMac, stop:stopOnMac};
   }
   else if(process.platform==="linux"){
      player={play:playOnLinux, stop:stopOnLinux};
   }
   if(!player || !link){
      terminalBell();
      return null;
   }
   try{
      await player.play(spotUri(link), start);
   }
   catch(err){
      console.error("spot error: ", err.message);
      terminalBell();
      return null;
   }
   return player.stop;
}

module.exports={startSong};


