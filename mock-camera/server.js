const RtspServer = require("rtsp-streaming-server").default;
const ffmpeg = require("fluent-ffmpeg");
const os = require("os");

const videoPath = "./videos/0413.mp4"; // your video path

// Hàm lấy địa chỉ IP hiện tại
function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address; // Trả về địa chỉ IPv4 không phải localhost
      }
    }
  }
  return "127.0.0.1"; // Trả về localhost nếu không tìm thấy
}

// Create server with available ports
async function createServer() {
  try {
    const server = new RtspServer({
      serverPort: 5554,
      clientPort: 6554,
      rtpPortStart: 10000,
      rtpPortCount: 10000,
      keepAlive: true,
      keepAliveTimeout: 30000,
      maxretries: 5,
      retryDelay: 5000,
    });

    return server;
  } catch (error) {
    throw new Error(`Cannot find available port: ${error.message}`);
  }
}

// main function to run the server and stream video
async function run() {
  try {
    const localIp = getLocalIpAddress();
    // init server
    const server = await createServer();

    // start server
    await server.start();
    console.log(`RTSP server started on rtsp://${localIp}:5554/live`);

    // wait for server to start before starting ffmpeg
    setTimeout(() => {
      ffmpeg(videoPath)
        .inputOptions("-stream_loop -1")
        .outputOptions(["-f rtsp", "-an"])
        .output(`rtsp://${localIp}:5554/live`)
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
process.on("SIGINT", async () => {
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
