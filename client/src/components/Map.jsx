// src/components/Map.tsx
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cameraIcon from '../assets/camera-icon.png';
import { useEffect, useState, useRef } from 'react';
import cam1 from '../assets/cam2.png';
import TrafficDashboard from './TrafficDashboard';
import CameraList from './CameraList';

const customIcon = new L.Icon({
    iconUrl: cameraIcon,
    iconSize: [32, 32],
    iconAnchor: [0, 32],
    popupAnchor: [0, -32],
});

const roadCoordinates = [
    [10.801296448702058, 106.71170362134797],
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
    const [isStuck, setIsStuck] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false); // Trạng thái hiển thị dashboard
    const [showCamList, setShowCamList] = useState(false); // Trạng thái hiển thị danh sách camera
    const mapRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsStuck((prev) => !prev);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const toggleDashboard = () => {
        setShowDashboard((prev) => !prev);
    };
    const toggleCamList = () => {
        setShowCamList((prev) => !prev);
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            {/* Navbar */}
            <nav style={{
                position: 'absolute',
                top: '10px',
                right: '50px',
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                gap: '10px',
            }}>
                <button onClick={toggleDashboard} style={{
                    cursor: 'pointer',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: 'white',
                }}>
                    {showDashboard ? 'Dashboard' : 'Dashboard'}
                </button>
                <button onClick={toggleCamList} style={{
                    cursor: 'pointer',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: 'white',
                }}>
                    {showDashboard ? 'Camera' : 'Camera'}
                </button>
            </nav>

            <MapContainer center={[10.80150127059038, 106.71146295089262]} zoom={18} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[10.801296448702058, 106.71170362134797]} icon={customIcon}>
                    <Popup style={{ width: '450px' }}>
                        <h1>Camera Ngã Tư</h1>
                        <img src={cam1} alt="Camera View" style={{ width: '100%' }} />
                        <p>Thời gian: 13:00 12/11/2023</p>
                        <p>
                            - Đường thoáng <br />
                            - Phương tiện phát hiện: 9 <br />
                            - Thời tiết: quang đãng <br />
                            - Dòng phương tiện: nhanh (13m/s)
                        </p>
                    </Popup>
                </Marker>
                {isStuck ? <Polyline pathOptions={trafficStyle} positions={roadCoordinates} /> : null}
            </MapContainer>

            {/* Traffic Dashboard */}
            {showDashboard && (
                <div style={{
                    position: 'absolute',
                    top: '100px',
                    left: '10px',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                    <TrafficDashboard />
                </div>
            )}
            {showCamList && (
                <div style={{
                    position: 'absolute',
                    top: '100px', 
                    right: '10px',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                    <CameraList mapRef={mapRef}/>
                </div>
            )}
        </div>
    );
}
