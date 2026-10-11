# GOLAZOOOOO!!! 

`barcagolazo` watches FC Barcelona's matches and when they score, flashes your whole terminal in the Blaugrana colours, plays a sound and shows the live score. 

```
     ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⣴⠳⠶⣤⣤⠶⠋⣉⠙⠶⣤⣤⠶⠋⡉⠙⠶⣤⣤⠶⠞⣦⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠙⣄⠀⠀⠀⠀⣿⣿⡇⠀⠀⣶⡇⣿⡇⣿⡇⣶⡆⠀⣠⠋⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠹⣄⠀⣶⣶⣿⣿⣷⣶⡆⣿⡇⣿⡇⣿⡇⣿⡇⣠⠏⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣏⠀⠿⠿⣿⣿⡿⠿⠇⣿⡇⣿⡇⣿⡇⣿⡇⣹⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⣿⣿⡇⠀⠀⣿⡇⣿⡇⣿⡇⣿⡇⠙⣆⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⣠⠏⠉⠉⠉⠉⠀⣭⣭⠉⣩⣍⠉⣭⢍⠉⠉⠉⠉⠉⠹⣄⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⢴⡋⠀⠀⠀⠀⠀⠀⣿⠒⠀⢿⡤⠀⣿⡱⠀⠀⠀⠀⠀⠀⠀⢙⡦⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⣧⠀⣿⣿⣿⠉⠉⣿⣿⣿⠉⠉⣿⣿⣿⠉⠉⣿⣿⣿⠀⣼⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⣿⠀⣿⣿⣿⠀⠀⣿⣿⡫⢙⠭⡙⣿⣿⠀⠀⣿⣿⣿⠀⣿⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⢹⣄⢻⣿⣿⠀⠀⣿⣏⢑⣈⠒⣀⣹⣿⠀⠀⣿⣿⡟⣠⡏⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠙⣄⠻⣿⠀⠀⣿⣿⣅⣔⣊⣠⣿⣿⠀⠀⣿⠟⣠⠋⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⣄⠀⠀⢿⣿⣿⠀⠀⣿⣿⡿⠀⠀⣠⠞⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠉⠛⠶⠶⣄⠀⠀⣠⠶⠶⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠙⠋
 
GOLAZOOOOO!!!   Barça 3-0 RMA
```

## Requirements

- [Node.js](https://nodejs.org) 18 or newer.
- A free API key from [football-data.org](https://www.football-data.org/client/register) (sent as an email).
- Optional, for the song: the Spotify desktop app on MacOs, or Spotify plus `playerctl` on Linux.⠀⠀

## Install

```bash
npm install -g barcagolazo
```

## Set your API key

The key is read from the `FOOTBALL_DATA_KEY` environment variable, so it never ends up in the code. 

**Mac/Linux**

```bash
export FOOTBALL_DATA_KEY=yourkey
```
**Windows**

```powershell
$env:FOOTBALL_DATA_KEY="yourkey"
```
This lasts until you close the terminal. 

On Mac, add the `export` line to your `~/.zshrc` if you want to keep it permanently.

## Usage 

Start watching:

```bash
barcagolazo
```

Leave it running in a terminal window. It prints the next Barça match, checks the score every 30 seconds during the game, and celebrates when Barça scores. 
To stop, press `Ctrl+C`.

If you simply want to preview the celebration, without having to wait for an actual goal during a match:

```bash
barcagolazo --test
```

## How `barcagolazo` works

- When no match is close, it checks once an hour.
- When a match is coming up, it checks every 10 minutes until kickoff.
- During the match it checks every 30 seconds and compares Barça's goals with the last check.
- Goals scored before you start the session are not celebrated and if VAR causes a goal to be taken back, the score is just quietly updated.
- On a goal, the terminal flashes. If Spotify is available, it plays a snippet of a song and pauses it afterwards. If not (or on Windows), it plays a short alert sound instead.

## Good to know

- **Song playback**: macOS asks for permission the first time, so that your terminal can control Spotify. Click OK. Spotify is opened in the background if it isn't already running, and it takes over whatever you were listening to. Free Spotify accounts may not always start the song at the chosen position.
- **Not every competition is covered.** Alerts only come for La Liga and the Champions League, but not Copa del Rey matches.
- **The celebration alerts do not arrive exactly in real time** as there is a slight delay.

## Credits

Match data from [football-data.org](https://www.football-data.org).

Barça ASCII logo from https://emojicombos.com/fc-barcelona-ascii-art.

This is a fan project, not affiliated with or endorsed by FC Barcelona. 


UCL 2027 let's goo! :) 




⠀⠀⠀⠀⠀⠀⠀⠀⠀



