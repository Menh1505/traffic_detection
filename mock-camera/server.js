const RtspServer = require("rtsp-streaming-server").default;
const ffmpeg = require("fluent-ffmpeg");
const portscanner = require("portscanner");

const videoPath = "./videos/test.mp4";

// Configuration options
const CONFIG = {
  server: {
    serverPort: 5554,
    clientPort: 6554,
    rtpPortStart: 10000,
    rtpPortCount: 10000,
    keepAliveTimeout: 30000,    // 30 seconds timeout for keep-alive
    streamKeepAlive: true,      // Enable stream keep-alive
    maxRetries: 3,              // Maximum reconnection attempts
    retryDelay: 5000,           // 5 seconds delay between retries
  },
  ffmpeg: {
    bufferSize: "2048k",        // Buffer size for streaming
    keyframeInterval: 52,       // Keyframe interval
    bitrate: "2000k",           // Default bitrate
    framerate: 30,              // Default framerate
  }
};

let ffmpegProcess = null;
let server = null;

// Create server with enhanced configuration
async function createServer() {
  try {
    server = new RtspServer({
      ...CONFIG.server,
      // Additional stability options
      rtspTcpTransport: true,   // Use TCP for more stable transmission
      allowedOrigins: ["*"],    // Configure allowed origins
      logLevel: "info"          // Enable logging
    });

    // Add connection monitoring
    server.on('connection', (client) => {
      console.log(`Client connected: ${client.id}`);
      
      client.on('error', (err) => {
        console.error(`Client error: ${client.id}`, err.message);
      });
      
      client.on('close', () => {
        console.log(`Client disconnected: ${client.id}`);
      });
    });

    return server;
  } catch (error) {
    throw new Error(`Server initialization failed: ${error.message}`);
  }
}

// Enhanced FFmpeg streaming function
function startFFmpeg() {
  try {
    ffmpegProcess = ffmpeg(videoPath)
      .inputOptions([
        "-stream_loop -1",       // Loop the video
        "-re",                   // Read input at native framerate
        "-fflags +genpts",       // Generate presentation timestamps
        "-rtsp_transport tcp"    // Use TCP for transmission
      ])
      .outputOptions([
        "-f rtsp",              // Force RTSP format
        "-movflags faststart",   // Enable fast start
        `-g ${CONFIG.ffmpeg.keyframeInterval}`,     // Set keyframe interval
        `-bufsize ${CONFIG.ffmpeg.bufferSize}`,     // Set buffer size
        `-b:v ${CONFIG.ffmpeg.bitrate}`,           // Set video bitrate
        `-r ${CONFIG.ffmpeg.framerate}`,           // Set framerate
        "-preset ultrafast",     // Use ultrafast encoding preset
        "-tune zerolatency"     // Optimize for low latency
      ])
      .output(`rtsp://localhost:${CONFIG.server.serverPort}/live`)
      .on("start", (commandLine) => {
        console.log("FFmpeg process started:", commandLine);
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        // Attempt to restart FFmpeg on error
        handleFFmpegError();
      })
      .on("end", () => {
        console.log("FFmpeg process finished");
      });

    ffmpegProcess.run();
  } catch (error) {
    console.error("Error starting FFmpeg:", error);
    handleFFmpegError();
  }
}

// Error handling for FFmpeg
let retryCount = 0;
async function handleFFmpegError() {
  if (retryCount < CONFIG.server.maxRetries) {
    retryCount++;
    console.log(`Attempting to restart FFmpeg (Attempt ${retryCount}/${CONFIG.server.maxRetries})`);
    
    // Exponential backoff for retry delay
    const delay = CONFIG.server.retryDelay * Math.pow(2, retryCount - 1);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    startFFmpeg();
  } else {
    console.error("Maximum retry attempts reached. Please check the stream configuration.");
  }
}

// Enhanced server monitoring
function setupServerMonitoring() {
  // Heartbeat mechanism
  setInterval(() => {
    if (server && server.isRunning) {
      console.log("Server heartbeat: OK");
    } else {
      console.error("Server heartbeat: Failed");
      restartServer();
    }
  }, CONFIG.server.keepAliveTimeout);
}

// Server restart function
async function restartServer() {
  try {
    if (server) {
      await server.stop();
    }
    server = await createServer();
    await server.start();
    startFFmpeg();
  } catch (error) {
    console.error("Error restarting server:", error);
  }
}

// Main function with enhanced error handling
async function run() {
  try {
    server = await createServer();
    await server.start();
    console.log(`RTSP server started on rtsp://localhost:${CONFIG.server.serverPort}/live`);
    
    setupServerMonitoring();
    
    // Start FFmpeg after server initialization
    setTimeout(startFFmpeg, 2000);
  } catch (error) {
    console.error("Error in main execution:", error);
    process.exit(1);
  }
}

// Enhanced process termination handling
async function cleanup() {
  console.log("\nShutting down server...");
  try {
    if (ffmpegProcess) {
      ffmpegProcess.kill();
    }
    if (server) {
      await server.stop();
    }
    console.log("Server stopped successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

// Handle various termination signals
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  cleanup();
});

run();
