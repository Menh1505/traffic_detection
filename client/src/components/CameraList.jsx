// src/components/CameraList.tsx
import React from 'react';

const CameraList = ({ mapRef, cameras, setCurrentCameraId }) => { 
    // Tạo danh sách 20 tên camera giả

    const handleCameraClick = (camera) => {
        if (mapRef.current) {
            mapRef.current.setView([camera.position[0], camera.position[1]], 18);
            setCurrentCameraId(camera.id);
        }
    };

    return (
        <div style={{
            padding: '0px',
            backgroundColor: '#1D253A',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1)',
            height: '100%',
            overflowY: 'auto',
        }}>
            <h3>DANH SÁCH CAMERA</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {cameras.map((camera) => (
                    <li key={camera.id} style={{ margin: '10px 0' }}>
                        <button
                            onClick={() => handleCameraClick(camera)}
                            className='camera-button'
                            style={{
                                padding: '10px',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#1D253A',
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
            <style>{`
    .camera-button:hover {
        background-color: #2A334D;
    }
`}</style>
        </div>
    );
};

export default CameraList;
