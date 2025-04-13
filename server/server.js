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

new Stream(streamConfig);

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port", process.env.PORT || 8080);
});
