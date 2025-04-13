import React, { useEffect, useRef } from 'react';

const JSMpegPlayer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Tạo thẻ script để tải jsmpeg.min.js
    const script = document.createElement('script');
    script.src = '/jsmpeg.min.js'; // Đường dẫn đến file jsmpeg.min.js
    script.async = true;

    // Thêm script vào document
    document.body.appendChild(script);

    // Khởi tạo player khi script đã được tải
    script.onload = () => {
      new window.JSMpeg.Player('ws://localhost:9999', {
        canvas: canvasRef.current, // Sử dụng canvas DOM element
      });
    };

    // Dọn dẹp khi component unmount
    return () => {
      document.body.removeChild(script); // Xóa script khi component unmount
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '800px' }} />
    </div>
  );
};

export default JSMpegPlayer;
