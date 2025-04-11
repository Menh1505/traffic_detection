const RtspServer = require("rtsp-streaming-server").default;
const ffmpeg = require("fluent-ffmpeg");

const server = new RtspServer({
  serverPort: 5554,
  clientPort: 6554,
  rtpPortStart: 10000,
  rtpPortEnd: 10050,
});

const videoPath = "./videos/test.mp4"; // your video path

async function run() {
  try {
    await server.start();
    console.log("RTSP server started on rtsp://localhost:5554/live");

    // Setting ffmpeg to stream the video to the RTSP server
    ffmpeg(videoPath)
      .inputOptions("-stream_loop -1") // loop video
      .outputOptions("-f rtsp")
      .output("rtsp://localhost:5554/live")
      .on("start", function (commandLine) {
        console.log("FFmpeg process started: " + commandLine);
      })
      .on("error", function (err) {
        console.error("FFmpeg error: " + err.message);
      })
      .on("end", function () {
        console.log("FFmpeg process finished.");
      });
  } catch (e) {
    console.error(e);
  }
}

run();
