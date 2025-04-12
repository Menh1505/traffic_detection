const ffmpegConfig = {
  input: {
    rtsp: "rtsp://localhost:5554/live",
  },
  output: {
    hls: {
      path: "./streams/output.m3u8",
      options: [
        "-c:v",
        "copy", // Giữ nguyên codec video
        "-an", // Không có âm thanh
        "-hls_time",
        "2", // Độ dài segment 2 giây
        "-hls_list_size",
        "5", // Giữ 5 segment trong playlist
        "-hls_flags",
        "delete_segments+append_list", // Tự động xóa segment cũ
        "-hls_segment_type",
        "fmp4", // Sử dụng định dạng fMP4
        "-tune",
        "zerolatency", // Tối ưu cho độ trễ thấp
      ],
    },
  },
};

module.exports = ffmpegConfig;