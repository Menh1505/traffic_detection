import cv2
import torch
from ultralytics import YOLO
from datetime import datetime
from PIL import ImageFont, ImageDraw, Image
import numpy as np

# ======== CẤU HÌNH ========
vehicle_labels = ["car", "motorcycle", "bus", "truck", "bicycle"]
color_map = {
    "car": (0, 255, 0),
    "motorcycle": (0, 0, 255),
    "bus": (255, 0, 0),
    "truck": (255, 255, 0),
    "bicycle": (255, 0, 255)
}
vehicle_weight = {
    "car": 1,
    "motorcycle": 0.5,
    "bus": 4,
    "truck": 3,
    "bicycle": 0.3
}
road_area_map = {
    "Ngã tư Hàng Xanh": 100,
    "Cầu Sài Gòn": 120,
    "Ngã tư Thủ Đức": 90,
    "Không rõ": 100
}

# ======== MODEL YOLO ========
model = YOLO("yolov8m.pt")
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model.to(device)

# ======== VẼ CHỮ TIẾNG VIỆT ========
def draw_vietnamese_text(img_cv2, text, pos, font_size=22, color=(255, 255, 255), font_path="arial.ttf"):
    img_pil = Image.fromarray(img_cv2)
    draw = ImageDraw.Draw(img_pil)
    try:
        font = ImageFont.truetype(font_path, font_size)
    except:
        font = ImageFont.load_default()
    draw.text(pos, text, font=font, fill=color)
    return np.array(img_pil)

# ======== TÍNH TOÁN TÌNH TRẠNG GIAO THÔNG ========
def calculate_density(vehicle_count, area):
    density = sum(vehicle_count[label] * vehicle_weight[label] for label in vehicle_labels)
    return density / area

def get_congestion_status(density):
    if density <= 0.1:
        return "Thông thoáng"
    elif density <= 0.3:
        return "Bình thường"
    elif density <= 0.5:
        return "Đông đúc"
    else:
        return "Kẹt xe"

# ======== XỬ LÝ VIDEO ========
def detect_congestion(video_path, camera_id="CAM01", location="Không rõ"):
    cap = cv2.VideoCapture(video_path)
    print(f"🎥 Đang xử lý video từ {camera_id} - {location}\n")

    area = road_area_map.get(location, 100)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("✅ Video đã xử lý xong.")
            break

        frame = cv2.resize(frame, (960, 540))
        results = model(frame, conf=0.3, verbose=False)[0]

        vehicle_count = {label: 0 for label in vehicle_labels}

        for box in results.boxes:
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            if label in vehicle_labels:
                vehicle_count[label] += 1
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                color = color_map.get(label, (255, 255, 255))
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                frame = draw_vietnamese_text(frame, label, (x1, y1 - 20), font_size=20, color=color)

        density = calculate_density(vehicle_count, area)
        status = get_congestion_status(density)
        timestamp = datetime.now().strftime('%H:%M:%S')

        # ===== THÊM THÔNG TIN LÊN VIDEO =====
        frame = draw_vietnamese_text(frame, f"Camera: {camera_id} - {location}", (10, 10))
        frame = draw_vietnamese_text(frame, f"Thời gian: {timestamp}", (10, 35), font_size=20)
        frame = draw_vietnamese_text(frame, f"Trạng thái: {status}", (700, 35), color=(0, 255, 255), font_size=20)
        frame = draw_vietnamese_text(frame, f"Số lượng xe:{vehicle_count}",(700, 45), color=(0, 255, 255), font_size=20)

        # ===== HIỂN THỊ =====
        cv2.imshow("Phát hiện kẹt xe", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

    cap.release()
    cv2.destroyAllWindows()

# ======== CHẠY THỬ ========
if __name__ == "__main__":
    video_path = "videos/2.mp4"
    detect_congestion(video_path, camera_id="CAM01", location="Ngã tư Hàng Xanh")
