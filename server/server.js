import app from "./src/app.js";
import express from "express";
import streamConfig from "./src/configs/config.stream.js";
import cors from "cors";
import dotenv from "dotenv";
import Stream from "node-rtsp-stream";

dotenv.config();

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);

// serve files HLS
app.use("/streams", express.static("streams"));

stream = new Stream(streamConfig);


// Init stream HLS
/* function startStreaming() {
  const stream = ffmpeg(ffmpegConfig.input.rtsp)
    .outputOptions(ffmpegConfig.output.hls.options)
    .output(ffmpegConfig.output.hls.path)
    .on("start", () => {
      console.log("Stream started");
    })
    .on("error", (err) => {
      console.error("Stream error:", err);
      // Auto restart stream on error every 5 seconds
      setTimeout(startStreaming, 5000);
    })
    .on("end", () => {
      console.log("Stream finished");
    })
    .save(ffmpegConfig.output.hls.path);

  stream.run();

  setInterval(() => {cleanOldSegments("./streams");}, 30000); // Clean old segments every 30s
  setInterval(() => {monitorDiskUsage("./streams");}, 300000); // Monitor disk usage every 5 minutes
} */

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port", process.env.PORT || 8080);
});
