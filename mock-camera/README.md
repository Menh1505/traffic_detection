# Mock Camera Server

## Requirement

[Node](https://nodejs.org/en)
[ffmpeg](https://www.ffmpeg.org/download.html)

## How to run

- Put your video into videos/ directory
- Change videoPath in `server.js` to your video name
- Run command below in terminal:
```bash
npm i
node server.js
```
- Now you can access stream by any RTSP watcher at url: `rtsp://localhost:554/live`