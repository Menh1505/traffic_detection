const streamConfig = {
  name: "camera_stream",
  streamUrl: "rtsp://192.168.1.9:6554/live", // URL của camera
  wsPort: 9999,
  ffmpegOptions: {
    "-stats": "",
    "-r": 30,
    "-s": "640x480",
  },
};

module.exports = streamConfig;
