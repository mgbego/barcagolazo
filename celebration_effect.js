let colours= require("./config").colours;
let {barcalogo}= require("./logo");
let config=require("./config");
let {startSong}=require("./song");


function makeLogo(score){
   return barcalogo.concat(["", "GOLAZOOOOO!!!   " +score]);
}

function drawOnScreen(colour, picture){
   let cols= process.stdout.columns || 80;
   let rows= (process.stdout.rows||24)-1;
   let top= Math.max(0, Math.floor((rows-picture.length)/2));
   let screen=colours.clear+colour+colours.white;
   for (let i=0; i<rows; ++i){
      let text=picture[i-top] || ""; //blank above and below the logo
      let left= Math.max(0, Math.floor((cols-text.length)/2));
      screen+=(" ".repeat(left)+text).padEnd(cols).slice(0, cols);
   }

   process.stdout.write(screen)

}

async function celebrate(score){
   let picture=makeLogo(score);
   let flashing_colours=[colours.blue, colours.garnet];

   let stopSong=await startSong(config.song, config.songStart); //wait until the song is really playing
   let flashes=Math.round(config.songLength*1000/400); //flash for as long as the song plays

   for(let i=0; i<flashes; ++i){
      drawOnScreen(flashing_colours[i%2], picture);
      await wait(400);
   }
   process.stdout.write(colours.reset+colours.clear);

   if(stopSong){
      try{
         await stopSong();
      }
      catch(err){
         //spotify was closed during the celebration: nothing to stop
      }
   }
}

function wait(waittime){
   return new Promise(function(resolve){
      setTimeout(resolve, waittime);
   });
}

module.exports={celebrate};

