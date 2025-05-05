// src/components/Map.tsx
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cameraIcon from '../assets/camera-icon.png';
import { useEffect, useState, useRef } from 'react';
import cam1 from '../assets/cam2.png';
import TrafficDashboard from './TrafficDashboard';
import CameraList from './CameraList';
import Navbar from './navbar';

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
        return { color: 'red', weight: 14 };
    } else if (congestionLevel > 0.5) {
        return { color: 'orange', weight: 11 };
    } else if (congestionLevel > 0.2) {
        return { color: 'yellow', weight: 9 };
    } else {
        return { color: 'green', weight: 7 };
    }
};
const trafficStyle = getTrafficStyle(congestionLevel);

const cameras = [
    { id: 1, name: 'Ngã tư Hàng Xanh', position: [10.801296448702058, 106.71170362134797] },
    { id: 2, name: 'Ngã tư Bạch Đằng', position: [10.803062, 106.709385] },
    { id: 3, name: 'Trường UTH', position: [10.804268, 106.716693] },
    { id: 4, name: 'Ngã tư D2', position: [10.807563, 106.716395] },
    { id: 5, name: 'Đại học Hồng Bàng', position: [10.799973, 106.707279] },
    { id: 6, name: '153 D. Xô Viết Nghệ Tĩnh', position: [10.797149, 106.710626] },
    { id: 7, name: 'Khu du lịch Văn Thánh', position: [10.799673, 106.717575] },
    { id: 8, name: '426A D. Xô Viết Nghệ Tĩnh', position: [10.806265, 106.711538] },
];

export default function Map() {
    const [isStuck, setIsStuck] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsStuck((prev) => !prev);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header/Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', padding: '20 10 0 0 ' }}>
                {/* Left Sidebar */}
                <aside style={{
                    width: '35%',
                    height: '50vh',
                    backgroundColor: '#141B2D',
                    padding: '5px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                }}>
                    <CameraList mapRef={mapRef} cameras={cameras} />
                </aside>

                {/* Primary Content Area */}
                <main style={{ flex: 1, position: 'relative', backgroundColor: '#141B2D' }}>
                    <MapContainer
                        center={[10.80150127059038, 106.71146295089262]}
                        zoom={18}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {cameras.map((camera) => (
                            <Marker key={camera.id} position={camera.position} icon={customIcon}>
                                <Popup style={{ width: '450px' }}>
                                    <h1>{camera.name}</h1>
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
                        ))}
                        {isStuck ? <Polyline pathOptions={trafficStyle} positions={roadCoordinates} /> : null}
                    </MapContainer>
                </main>
            </div>

            {/* Footer/Chart Area */}
            <footer style={{
                width: '100%',
                backgroundColor: '#141B2D',
                padding: '5px',
                boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
            }}>
                <TrafficDashboard />
            </footer>
        </div>
    );
}
