import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cameraIcon from '../assets/camera-icon.png';
import VideoStream from './VideoStream'; 
import { useEffect, useState } from 'react';


const customIcon = new L.Icon({
    iconUrl: cameraIcon, // Đường dẫn đến icon tùy chỉnh
    iconSize: [32, 32],     // Kích thước của icon (width, height)
    iconAnchor: [0, 32],   // Điểm neo của icon (tọa độ điểm sẽ khớp với vị trí)
    popupAnchor: [0, -32],    // Điểm neo của popup so với icon
});

const roadCoordinates = [
    [10.801296448702058, 106.71170362134797], // Điểm đầu
    [10.801296448702058, 106.71270362134798],
    [10.801276448702058, 106.71270362134698],
];


const congestionLevel = 0.9;
const getTrafficStyle = (congestionLevel) => {
    if (congestionLevel > 0.8) {
        return { color: 'red', weight: 20 };
    } else if (congestionLevel > 0.5) {
        return { color: 'orange', weight: 11 };
    } else if (congestionLevel > 0.2) {
        return { color: 'yellow', weight: 9 };
    } else {
        return { color: 'green', weight: 7 };
    }
};
const trafficStyle = getTrafficStyle(congestionLevel);

export default function Map() {
    const [isStuck, setIsStuck] = useState(false); // Trạng thái tắc đường

    useEffect(() => {
        const interval = setInterval(() => {
            // Giả lập trạng thái tắc đường
            setIsStuck((prev) => !prev);
        }, 5000); // Cập nhật trạng thái mỗi 5 giây

        return () => clearInterval(interval); // Dọn dẹp khi component unmount
    }, []); // Hook để theo dõi trạng thái tắc đường

    return (
        <div style={{ height: '100%', width: '100%' }}> {/* Container bao ngoài */}
            <MapContainer center={[10.80150127059038, 106.71146295089262]} zoom={18} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}> {/* Style cho MapContainer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[10.801296448702058, 106.71170362134797]} icon={customIcon}>
                    <Popup style={{ width: '4500px' }}>
                        <h2>Camera</h2>
                        <VideoStream />
                    </Popup>
                </Marker>
                {isStuck ? <Polyline pathOptions={trafficStyle} positions={roadCoordinates} /> : null}
            </MapContainer>
        </div>
    );
}