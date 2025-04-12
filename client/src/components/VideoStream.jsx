import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      hlsRef.current = new Hls({
        // config hls.js for low latency
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        liveSyncDurationCount: 3,
      });

      hlsRef.current.loadSource('http://localhost:8080/streams/output.m3u8');
      hlsRef.current.attachMedia(videoRef.current);

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: '100%', maxWidth: '800px' }}
        autoPlay
        muted
      />
    </div>
  );
};

export default VideoPlayer;
