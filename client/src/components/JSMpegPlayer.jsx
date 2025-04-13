// components/JSMpegPlayer.jsx
import { useEffect, useRef } from "react";

function JSMpegPlayer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Load JSMpeg from global script
    const script = document.createElement("script");
    script.src = "/js/jsmpeg.min.js";
    script.onload = () => {
      // Gọi player sau khi script đã tải
      new window.JSMpeg.Player("ws://localhost:9999", {
        canvas: canvasRef.current,
      });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup nếu cần sau này
      document.body.removeChild(script);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      style={{ width: "100%", height: "auto", background: "black" }}
    />
  );
}

export default JSMpegPlayer;
