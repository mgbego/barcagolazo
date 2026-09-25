let colours= require("./config").colours;

function drawOnScreen(colour, message){
   let cols= process.stdout.columns || 80;
   let rows= (process.stdout.rows||24)-1;
   let blank=" ".repeat(cols);
   let left= Math.max(0, Math.floor((cols-message.length)/2));
   let line=(" ".repeat(left)+message).padEnd(cols);
   let screen=colours.clear+colour+colours.white;
   for (let i=0; i<rows; ++i){
      if(i==Math.floor(rows/2)){
         screen+=line;
      }
      else{
         screen+=blank;
      }
   }

   process.stdout.write(screen)

}

async function celebrate(score){
   let message= "GOLAZOOOOO!!!   " +score;
   let flashing_colours=[colours.blue, colours.garnet];
   process.stdout.write("\x07");
   for (let i=0; i<10; ++i){
      drawOnScreen(flashing_colours[i%2], message);
      await wait(400);
   }
   process.stdout.write(colours.reset+colours.clear)
}

function wait(waittime){
   return new Promise(function(resolve){
      setTimeout(resolve, waittime);
   });
}

module.exports={celebrate}