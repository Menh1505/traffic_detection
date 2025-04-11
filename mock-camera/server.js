const RtspServer = require("rtsp-streaming-server").default;
const ffmpeg = require("fluent-ffmpeg");
const portscanner = require("portscanner");

const videoPath = "./videos/test.mp4"; // your video path

// Find available port for the RTSP server
async function findAvailablePort(startPort, endPort) {
  return new Promise((resolve, reject) => {
    portscanner.findAPortNotInUse(startPort, endPort, "127.0.0.1", (error, port) => {
      if (error) {
        reject(error);
      } else {
        resolve(port);
      }
    });
  });
}

// Create server with available ports
async function createServer() {
  try {
    // Find port for server
    const serverPort = await findAvailablePort(5000, 6000);
    // Find port for client
    const clientPort = await findAvailablePort(6001, 7000);
    // Find range port RTP
    const rtpStart = await findAvailablePort(10000, 15000);
    const rtpEnd = rtpStart + 1000; // Set range 1000 port

    const server = new RtspServer({
      serverPort: serverPort,
      clientPort: clientPort,
      rtpPortStart: rtpStart,
      rtpPortEnd: rtpEnd,
    });

    return { server, serverPort };
  } catch (error) {
    throw new Error(`Cannot find available port: ${error.message}`);
  }
}

// main function to run the server and stream video
async function run() {
  try {
    // init server
    const { server, serverPort } = await createServer();

    // start server
    await server.start();
    console.log(`RTSP server started on rtsp://localhost:${serverPort}/live`);

    // error handling for server
    server.on("error", (error) => {
      console.error("Server error:", error);
    });

    // wait for server to start before starting ffmpeg
    setTimeout(() => {
      ffmpeg(videoPath)
        .inputOptions("-stream_loop -1")
        .outputOptions("-f rtsp")
        .output(`rtsp://localhost:${serverPort}/live`)
        .on("start", function (commandLine) {
          console.log("FFmpeg process started:", commandLine);
        })
        .on("error", function (err) {
          console.error("FFmpeg error:", err.message);
        })
        .on("end", function () {
          console.log("FFmpeg process finished");
        })
        .run();
    }, 2000);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

// Handle process termination signals
process.on('SIGINT', async () => {
  console.log("\nShutting down server...");
  try {
    await server.stop();
    console.log("Server stopped successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error stopping server:", error);
    process.exit(1);
  }
});
run();
