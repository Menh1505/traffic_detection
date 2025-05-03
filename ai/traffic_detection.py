import cv2
import torch
from ultralytics import YOLO
from datetime import datetime
from flask import Flask, jsonify
import numpy as np
import threading
import time

app = Flask(__name__)

class RTSPVideoProcessor:
    def __init__(self, rtsp_url, camera_id="CAM01", location="Không rõ"):
        # Cấu hình cơ bản
        self.rtsp_url = rtsp_url
        self.camera_id = camera_id
        self.location = location
        self.running = False
        
        # Khởi tạo model YOLO
        self.model = YOLO("yolov8m.pt")
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model.to(self.device)
        
        # Cấu hình phương tiện và trọng số
        self.vehicle_labels = ["car", "motorcycle", "bus", "truck", "bicycle"]
        self.vehicle_weight = {
            "car": 1,
            "motorcycle": 0.5,
            "bus": 4,
            "truck": 3,
            "bicycle": 0.3
        }
        
        # Định nghĩa road_area_map
        self.road_area_map = {
            "Ngã tư Hàng Xanh": 100,
            "Cầu Sài Gòn": 120,
            "Ngã tư Thủ Đức": 90,
            "Không rõ": 100
        }
        
        self.road_area = self.road_area_map.get(location, 100)
        self.current_density = 0
        self.current_status = "Không rõ"

    def start(self):
        """Khởi động luồng xử lý video"""
        self.running = True
        self.capture_thread = threading.Thread(target=self._capture_frames)
        self.capture_thread.daemon = True
        self.capture_thread.start()

    def _capture_frames(self):
        """Luồng riêng để capture frame"""
        cap = cv2.VideoCapture(self.rtsp_url)
        print(f"Đã kết nối tới camera: {self.camera_id}")
        
        while self.running:
            ret, frame = cap.read()
            if not ret:
                print("Lỗi đọc frame, đang cố gắng kết nối lại...")
                time.sleep(5)
                continue
            
            # Xử lý frame mỗi 5 giây
            self._process_frame(frame)
            time.sleep(5)  # Chờ 5 giây trước khi lấy frame tiếp theo

        cap.release()

    def _process_frame(self, frame):
        """Xử lý frame"""
        frame = cv2.resize(frame, (960, 540))
        
        # Phát hiện đối tượng với YOLO
        results = self.model(frame, conf=0.3, verbose=False)[0]
        
        # Đếm phương tiện
        vehicle_count = {label: 0 for label in self.vehicle_labels}
        for box in results.boxes:
            cls_id = int(box.cls[0])
            label = self.model.names[cls_id]
            
            if label in self.vehicle_labels:
                vehicle_count[label] += 1
        
        # Tính toán mật độ và trạng thái
        self.current_density = self.calculate_density(vehicle_count, self.road_area)
        self.current_status = self.get_congestion_status(self.current_density)

    def calculate_density(self, vehicle_count, area):
        density = sum(vehicle_count[label] * self.vehicle_weight[label] for label in self.vehicle_labels)
        return density / area

    def get_congestion_status(self, density):
        if density <= 0.1:
            return 1
        elif density <= 0.3:
            return 2
        elif density <= 0.5:
            return 3
        else:
            return 4

    def stop(self):
        """Dừng xử lý và giải phóng tài nguyên"""
        self.running = False
        if hasattr(self, 'capture_thread'):
            self.capture_thread.join()

@app.route('/congestion_status', methods=['GET'])
def congestion_status():
    """API để lấy trạng thái tắc nghẽn"""
    return jsonify({
        'density': processor.current_density,
        'status': processor.current_status
    })

# Sử dụng
if __name__ == "__main__":
    rtsp_url = "rtsp://192.168.1.9:6554/live"
    processor = RTSPVideoProcessor(rtsp_url, camera_id="CAM01", location="Ngã tư Hàng Xanh")
    
    try:
        processor.start()
        app.run(host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\nDừng xử lý...")
    finally:
        processor.stop()
        print("Đã dừng xử lý.")