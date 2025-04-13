import cv2
import torch
from ultralytics import YOLO
from datetime import datetime
from PIL import ImageFont, ImageDraw, Image
import numpy as np
import threading
from queue import Queue
import time

class RTSPVideoProcessor:
    def __init__(self, rtsp_url, camera_id="CAM01", location="Không rõ", buffer_size=10):
        # Cấu hình cơ bản
        self.rtsp_url = rtsp_url
        self.camera_id = camera_id
        self.location = location
        self.running = False
        self.frame_queue = Queue(maxsize=buffer_size)
        
        # Khởi tạo model YOLO
        self.model = YOLO("yolov8m.pt")
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model.to(self.device)
        
        # Cấu hình phương tiện và trọng số
        self.vehicle_labels = ["car", "motorcycle", "bus", "truck", "bicycle"]
        self.color_map = {
            "car": (0, 255, 0),
            "motorcycle": (0, 0, 255),
            "bus": (255, 0, 0),
            "truck": (255, 255, 0),
            "bicycle": (255, 0, 255)
        }
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

    def start(self):
        """Khởi động luồng xử lý video"""
        self.running = True
        self.capture_thread = threading.Thread(target=self._capture_frames)
        self.capture_thread.daemon = True
        self.capture_thread.start()
        self._process_frames()

    def _capture_frames(self):
        """Luồng riêng để capture frame"""
        while self.running:
            try:
                cap = cv2.VideoCapture(self.rtsp_url)
                print(f"Đã kết nối tới camera: {self.camera_id}")
                
                while self.running:
                    ret, frame = cap.read()
                    if not ret:
                        raise Exception("Lỗi đọc frame")
                    
                    # Chỉ thêm frame mới nếu queue không đầy
                    if not self.frame_queue.full():
                        self.frame_queue.put(frame)
                    else:
                        # Bỏ frame cũ nhất và thêm frame mới
                        try:
                            self.frame_queue.get_nowait()
                        except:
                            pass
                        self.frame_queue.put(frame)
                        
            except Exception as e:
                print(f"Lỗi stream: {str(e)}")
                if self.running:
                    print("Đang kết nối lại sau 5 giây...")
                    time.sleep(5)
                    continue

    def _process_frames(self):
        """Xử lý các frame"""
        try:
            last_fps_time = time.time()
            fps_counter = 0
            
            while self.running:
                if not self.frame_queue.empty():
                    frame = self.frame_queue.get()
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
                            x1, y1, x2, y2 = map(int, box.xyxy[0])
                            color = self.color_map.get(label, (255, 255, 255))
                            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                            frame = self.draw_vietnamese_text(frame, label, (x1, y1 - 20), 
                                                           font_size=20, color=color)
                    
                    # Tính toán mật độ và trạng thái
                    density = self.calculate_density(vehicle_count, self.road_area)
                    status = self.get_congestion_status(density)
                    timestamp = datetime.now().strftime('%H:%M:%S')
                    
                    # Hiển thị thông tin
                    frame = self.draw_vietnamese_text(frame, f"Camera: {self.camera_id} - {self.location}", (10, 10))
                    frame = self.draw_vietnamese_text(frame, f"Thời gian: {timestamp}", (10, 35))
                    frame = self.draw_vietnamese_text(frame, f"Trạng thái: {status}", (700, 35))
                    
                    # Tính FPS
                    fps_counter += 1
                    if time.time() - last_fps_time > 1.0:
                        print(f"FPS: {fps_counter}")
                        fps_counter = 0
                        last_fps_time = time.time()
                    
                    cv2.imshow("Phát hiện kẹt xe", frame)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                        
        except Exception as e:
            print(f"Lỗi xử lý: {str(e)}")
        finally:
            self.stop()

    def stop(self):
        """Dừng xử lý và giải phóng tài nguyên"""
        self.running = False
        if hasattr(self, 'capture_thread'):
            self.capture_thread.join()
        cv2.destroyAllWindows()

    # Giữ nguyên các phương thức hỗ trợ khác từ code gốc
    def draw_vietnamese_text(self, img_cv2, text, pos, font_size=22, color=(255, 255, 255)):
        img_pil = Image.fromarray(img_cv2)
        draw = ImageDraw.Draw(img_pil)
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        draw.text(pos, text, font=font, fill=color)
        return np.array(img_pil)

    def calculate_density(self, vehicle_count, area):
        density = sum(vehicle_count[label] * self.vehicle_weight[label] for label in self.vehicle_labels)
        return density / area

    def get_congestion_status(self, density):
        if density <= 0.1:
            return "Thông thoáng"
        elif density <= 0.3:
            return "Bình thường"
        elif density <= 0.5:
            return "Đông đúc"
        else:
            return "Kẹt xe"

# Sử dụng
if __name__ == "__main__":
    rtsp_url = "rtsp://192.168.1.9:6554/live"
    processor = RTSPVideoProcessor(rtsp_url, camera_id="CAM01", location="Ngã tư Hàng Xanh")
    
    try:
        processor.start()
    except KeyboardInterrupt:
        print("\nDừng xử lý...")
    except Exception as e:
        print(f"Lỗi: {str(e)}")
    finally:
        processor.stop()
