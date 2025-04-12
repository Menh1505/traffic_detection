const ffmpegConfig = {
  input: {
    rtsp: "rtsp://192.168.1.9:6554/live",
  },
  output: {
    hls: {
      path: "./streams/output.m3u8",
      options: [
        "-c:v", "libx264", // Mã hóa bằng cpu
        "-an", // Không có âm thanh
        "-preset", "fast", // Chọn preset nhanh
        "-hls_time", "2", // Độ dài segment 2 giây
        "-hls_list_size", "5", // Giữ 5 segment trong playlist
        "-hls_flags", "delete_segments+append_list", // Tự động xóa segment cũ
        "-hls_segment_type", "mpegts", // Sử dụng định dạng mpegts
        "-tune", "zerolatency", // Tối ưu cho độ trễ thấp
        "-vf", "scale=640:360", // Giảm độ phân giải xuống 720p
      ],
    },
  },
};

module.exports = ffmpegConfig;