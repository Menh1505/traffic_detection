const RtspServer = require('rtsp-streaming-server').default;
const fs = require('fs');
const path = require('path');

const server = new RtspServer({
  serverPort: 554,
  clientPort: 6554,
  rtpPortStart: 10000,
  rtpPortEnd: 10050,
});

const videoPath = path.join(__dirname, './videos/test.mp4'); // Đường dẫn đến file video
const streamName = 'live'; // Tên stream

server.on('clientConnected', client => {
  console.log('Client connected');
  client.on('teardown', () => console.log('Client disconnected'));
});

server.addStream({
  name: streamName,
  streamUrl: `file://${videoPath}`, // Đường dẫn đến file video
});

server.start();

console.log(`RTSP server started on port ${server.options.serverPort}`);
console.log(`Stream available at rtsp://localhost:${server.options.serverPort}/${streamName}`);