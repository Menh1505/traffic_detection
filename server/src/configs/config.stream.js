const streamConfig = {
  name: "camera_stream",
  streamUrl: "rtsp://camera_url:port/stream", // URL của camera
  wsPort: 9999,
  ffmpegOptions: {
    "-stats": "",
    "-r": 30,
    "-s": "640x480",
  },
};

export default streamConfig;
