const app = require("./src/app");
const ffmpegConfig = require("./src/configs/config.ffmpeg");


require("dotenv").config();

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);

// serve files HLS
app.use("/streams", express.static("streams"));

// Init stream HLS
function startStreaming() {
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
    });

  stream.run();
}

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port", process.env.PORT || 8080);
  startStreaming();
});
