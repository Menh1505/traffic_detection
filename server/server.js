const { app, io } = require("./src/app");
const Stream = require("node-rtsp-stream");

require("dotenv").config();

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

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port 3000");
});
