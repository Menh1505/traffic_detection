const RtspServer = require("rtsp-streaming-server").default;
const ffmpeg = require("fluent-ffmpeg");

const videoPath = "./videos/test.mp4"; // your video path

// Create server with available ports
async function createServer() {
  try {
    const server = new RtspServer({
      serverPort: 5554,
      clientPort: 6554,
      rtpPortStart: 10000,
      rtpPortCount: 10000,
      keepAliveTimeout: 30000,
      keepAlive: true,
      maxRetries: 3,
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
    // init server
    const server = await createServer();

    // start server
    await server.start();
    console.log(`RTSP server started on rtsp://localhost:5554/live`);

    // wait for server to start before starting ffmpeg
    setTimeout(() => {
      ffmpeg(videoPath)
        .inputOptions("-stream_loop -1") // Lặp lại video vô hạn
        .outputOptions([
          "-c:v libx264", // Sử dụng codec video libx264
          "-f rtsp", // Định dạng RTSP
          "-rtsp_transport tcp", // Sử dụng giao thức TCP để ổn định hơn
          "-preset ultrafast", // Tăng tốc độ mã hóa (giảm độ trễ)
          "-tune zerolatency", // Tối ưu hóa cho streaming thời gian thực
          "-g 50", // Đặt khoảng cách giữa các keyframe (GOP size)
          "-bufsize 64k", // Giảm kích thước buffer để giảm độ trễ
          "-maxrate 1M", // Giới hạn bitrate tối đa (1 Mbps)
          "-an", // Không có âm thanh
        ])
        .output(`rtsp://localhost:5554/live`)
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

    // Check server status every minute
    setInterval(() => {
      if (!server.isRunning) {
        console.error("Server is not running. Restarting...");
        run();
      }
    }, 60000); // Kiểm tra trạng thái server mỗi phút
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
