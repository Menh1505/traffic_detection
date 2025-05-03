import React from 'react';

const Navbar = () => {
    return (
        <header style={{
            width: '100%',
            backgroundColor: '#141B2D',
            padding: '10px 20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            {/* Logo or Title */}
            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                CHUYÊN ĐỀ HỆ THỐNG GIAO THÔNG THÔNG MINH
            </div>

            {/* Search Box */}
            <div style={{ flex: 1, marginLeft: '20px', marginRight: '20px' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        outline: 'none',
                    }}
                />
            </div>

            {/* Hamburger Button */}
            <button
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                }}
            >
                ☰
            </button>
        </header>
    );
};

export default Navbar;