const app = require("./src/app");
const Stream = require("node-rtsp-stream");
const streamConfig = require("./src/configs/config.stream");
const http = require("http");
const socketIo = require("socket.io");

require("dotenv").config();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  let stream = null;

  socket.on("start_stream", () => {
    try {
      if (!stream) {
        stream = new Stream(streamConfig);
        console.log("Stream started");
      }
    } catch (error) {
      socket.emit("stream_error", { message: "Failed to start stream" });
    }
  });

  socket.on("disconnect", () => {
    if (stream) {
      stream.stop();
      stream = null;
    }
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port", process.env.PORT || 8080);
});
