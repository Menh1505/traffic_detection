const streamConfig = {
  name: "camera_stream",
  streamUrl: "rtsp://localhost:5554/live", // URL của camera
  wsPort: 9999,
  ffmpegOptions: {
    "-stats": "",
    "-r": 30,
    "-s": "640x480",
  },
};

module.exports = streamConfig;
