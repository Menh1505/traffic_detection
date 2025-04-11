const RtspServer = require("rtsp-streaming-server").default;

const server = new RtspServer({
  serverPort: 5554,
  clientPort: 6554,
  rtpPortStart: 10000,
  rtpPortEnd: 10050,
});

async function run() {
  try {
    await server.start();
    console.log("RTSP server started on rtsp://localhost:5554/live");
  } catch (e) {
    console.error(e);
  }
}

run();
