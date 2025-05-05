import cv2
import torch
from ultralytics import YOLO
from flask import Flask, jsonify
import numpy as np
import threading
import time

app = Flask(__name__)

class RTSPVideoProcessor:
    def __init__(self, rtsp_url, camera_id="CAM01", location="Không rõ", weather="clear"):
        self.rtsp_url = rtsp_url
        self.camera_id = camera_id
        self.location = location
        self.weather = weather
        self.running = False

        self.model = YOLO("yolov8m.pt")
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model.to(self.device)

        self.vehicle_weights = {
            "motorcycle": 0.5, "bicycle": 0.3,
            "car": 1, "truck": 3, "bus": 4
        }
        self.vehicle_labels = list(self.vehicle_weights.keys())

        self.road_area_map = {
            "Ngã tư Hàng Xanh": 100,
            "Cầu Sài Gòn": 120,
            "Ngã tư Thủ Đức": 90,
            "Không rõ": 100
        }
        self.road_area = self.road_area_map.get(location, 100)

        self.current_density = 0
        self.current_status = 0
        self.vehicle_speeds = []
        self.previous_boxes = []

    def start(self):
        self.running = True
        threading.Thread(target=self._capture_frames, daemon=True).start()

    def _capture_frames(self):
        cap = cv2.VideoCapture(self.rtsp_url)
        print(f"Kết nối tới {self.camera_id} tại {self.location}")

        while self.running:
            ret, frame = cap.read()
            if not ret:
                print("Mất kết nối, thử lại...")
                time.sleep(5)
                continue
            self._process_frame(frame)
            time.sleep(5)

        cap.release()
        cv2.destroyAllWindows()

    def _process_frame(self, frame):
        frame = cv2.resize(frame, (960, 540))
        results = self.model(frame, conf=0.3, verbose=False)[0]

        vehicle_count = {l: 0 for l in self.vehicle_labels}
        current_boxes = []

        for box in results.boxes:
            cls_id = int(box.cls[0])
            label = self.model.names[cls_id]
            if label in self.vehicle_labels:
                vehicle_count[label] += 1
                current_boxes.append(box.xywh[0].cpu().numpy())

                # Vẽ box
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)
                cv2.putText(frame, label, (x1, y1 - 5),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0), 2)

        total_units = sum(vehicle_count[l]*self.vehicle_weights[l] for l in self.vehicle_labels)
        area = self.road_area * (0.8 if self.weather == "rain" else 1)
        self.current_density = total_units / area
        self.current_status = self.get_congestion_status(self.current_density)
        self.vehicle_speeds = self.estimate_speeds(self.previous_boxes, current_boxes)
        self.previous_boxes = current_boxes
# Hiển thị thông tin
        cv2.putText(frame,
                    f"Density: {self.current_density:.2f} | Status: {self.get_status_text()} | Weather: {self.weather}",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
        cv2.imshow(f"{self.camera_id} - {self.location}", frame)
        if cv2.waitKey(1) == 27:
            self.stop()

    def estimate_speeds(self, prev, curr):
        if not prev or not curr or len(prev) != len(curr):
            return []
        return [np.linalg.norm(c - p) / 5.0 for p, c in zip(prev, curr)]

    def get_congestion_status(self, d):
        if d <= 0.1: return 1
        elif d <= 0.3: return 2
        elif d <= 0.5: return 3
        return 4

    def get_status_text(self):
        return {
            1: "Thông thoáng",
            2: "Đông nhẹ",
            3: "Đông vừa",
            4: "Kẹt xe"
        }.get(self.current_status, "Không xác định")

    def stop(self):
        self.running = False
        cv2.destroyAllWindows()

@app.route('/congestion_status', methods=['GET'])
def congestion_status():
    return jsonify({
        "density": round(processor.current_density, 2),
        "status": processor.current_status,
        "status_text": processor.get_status_text(),
        "avg_speed": round(np.mean(processor.vehicle_speeds), 2) if processor.vehicle_speeds else 0,
        "weather": processor.weather
    })

if __name__ == "__main__":
    processor = RTSPVideoProcessor("rtsp://192.168.1.9:6554/live",
                                   camera_id="CAM01",
                                   location="Ngã tư Hàng Xanh",
                                   weather="rain")
    try:
        processor.start()
        app.run(host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        processor.stop()
        print("Đã thoát.")