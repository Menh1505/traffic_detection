import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import JSMpeg from 'jsmpeg';

const VideoStream = () => {
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const playerRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Khởi tạo kết nối socket
        socketRef.current = io('http://localhost:8080');
        
        socketRef.current.on('connect_error', (err) => {
            setError('Connection error: ' + err.message);
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            socketRef.current.emit('start_stream');
            
            // Khởi tạo player
            playerRef.current = new JSMpeg.Player('ws://localhost:9999', {
                canvas: canvasRef.current,
                autoplay: true,
                audio: false
            });
        });

        // Xử lý lỗi
        socketRef.current.on('stream_error', (error) => {
            setError(error.message);
        });

        // Cleanup
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="video-stream-container">
            <h2>Live Camera Stream</h2>
            {error && <div className="error-message">{error}</div>}
            <canvas 
                ref={canvasRef}
                style={{ width: '640px', height: '480px' }}
            />
            <div className="stream-status">
                Status: {isConnected ? 'Connected' : 'Disconnected'}
            </div>
        </div>
    );
};

export default VideoStream;
