let key= process.env.FOOTBALL_DATA_KEY;
let team=81;

let livewait= 30000;
let soonwait= 600000;
let nonewait= 3600000;
let errorwait= 60000;

let colours={
   blue: "\x1b[48;2;0;77;152m",
   garnet: "\x1b[48;2;165;0;68m",
   white: "\x1b[97;1m",
   reset: "\x1b[0m",
   clear: "\x1b[2J\x1b[H"

};

module.exports={key, team, livewait, soonwait, nonewait, errorwait, colours};
