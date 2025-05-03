// src/components/CameraList.tsx
import React from 'react';

const cameras = [
    { id: 1, name: 'Ngã tư Hàng Xanh', position: [10.801296448702058, 106.71170362134797] },
    { id: 2, name: 'Camera 2', position: [10.801276448702058, 106.71270362134698] },
    { id: 3, name: 'Camera 3', position: [10.801276448702060, 106.71270362134699] },
]
const CameraList = ({ mapRef }) => { 
    // Tạo danh sách 20 tên camera giả

    const handleCameraClick = (camera) => {
        if (mapRef.current) {
            mapRef.current.setView([camera.position[0], camera.position[1]], 18);
        }
    };

    return (
        <div style={{
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '400px',
            overflowY: 'auto',
        }}>
            <h3>Danh Sách Camera</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {cameras.map((camera) => (
                    <li key={camera.id} style={{ margin: '10px 0' }}>
                        <button
                            onClick={() => handleCameraClick(camera)}
                            style={{
                                padding: '10px',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            {camera.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CameraList;
