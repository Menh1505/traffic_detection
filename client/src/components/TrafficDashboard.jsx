import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d'];

const mockTrafficData = {
    1: [
        { day: 'Thứ 2', totalTraffic: 6000, cars: 4000, trucks: 2000, congestionScore: 80 },
        { day: 'Thứ 3', totalTraffic: 5800, cars: 3800, trucks: 2000, congestionScore: 75 },
        { day: 'Thứ 4', totalTraffic: 6200, cars: 4200, trucks: 2000, congestionScore: 85 },
        { day: 'Thứ 5', totalTraffic: 6100, cars: 4100, trucks: 2000, congestionScore: 82 },
        { day: 'Thứ 6', totalTraffic: 6300, cars: 4300, trucks: 2000, congestionScore: 88 },
        { day: 'Thứ 7', totalTraffic: 5000, cars: 3500, trucks: 1500, congestionScore: 70 },
        { day: 'CN', totalTraffic: 4500, cars: 3000, trucks: 1500, congestionScore: 65 },
    ],
    2: [
        { day: 'Thứ 2', totalTraffic: 7000, cars: 5000, trucks: 2000, congestionScore: 85 },
        { day: 'Thứ 3', totalTraffic: 6800, cars: 4800, trucks: 2000, congestionScore: 80 },
        { day: 'Thứ 4', totalTraffic: 7200, cars: 5200, trucks: 2000, congestionScore: 90 },
        { day: 'Thứ 5', totalTraffic: 7100, cars: 5100, trucks: 2000, congestionScore: 87 },
        { day: 'Thứ 6', totalTraffic: 7300, cars: 5300, trucks: 2000, congestionScore: 92 },
        { day: 'Thứ 7', totalTraffic: 6000, cars: 4500, trucks: 1500, congestionScore: 75 },
        { day: 'CN', totalTraffic: 5500, cars: 4000, trucks: 1500, congestionScore: 70 },
    ],
    3: [
        { day: 'Thứ 2', totalTraffic: 8000, cars: 6000, trucks: 2000, congestionScore: 90 },
        { day: 'Thứ 3', totalTraffic: 7800, cars: 5800, trucks: 2000, congestionScore: 85 },
        { day: 'Thứ 4', totalTraffic: 8200, cars: 6200, trucks: 2000, congestionScore: 95 },
        { day: 'Thứ 5', totalTraffic: 8100, cars: 6100, trucks: 2000, congestionScore: 92 },
        { day: 'Thứ 6', totalTraffic: 8300, cars: 6300, trucks: 2000, congestionScore: 97 },
        { day: 'Thứ 7', totalTraffic: 7000, cars: 5500, trucks: 1500, congestionScore: 80 },
        { day: 'CN', totalTraffic: 6500, cars: 5000, trucks: 1500, congestionScore: 75 },
    ],
    4: [
        { day: 'Thứ 2', totalTraffic: 5500, cars: 3500, trucks: 2000, congestionScore: 70 },
        { day: 'Thứ 3', totalTraffic: 5300, cars: 3300, trucks: 2000, congestionScore: 68 },
        { day: 'Thứ 4', totalTraffic: 5700, cars: 3700, trucks: 2000, congestionScore: 75 },
        { day: 'Thứ 5', totalTraffic: 5600, cars: 3600, trucks: 2000, congestionScore: 72 },
        { day: 'Thứ 6', totalTraffic: 5800, cars: 3800, trucks: 2000, congestionScore: 78 },
        { day: 'Thứ 7', totalTraffic: 4800, cars: 3300, trucks: 1500, congestionScore: 65 },
        { day: 'CN', totalTraffic: 4600, cars: 3100, trucks: 1500, congestionScore: 60 },
    ],
    5: [
        { day: 'Thứ 2', totalTraffic: 9000, cars: 7000, trucks: 2000, congestionScore: 95 },
        { day: 'Thứ 3', totalTraffic: 8800, cars: 6800, trucks: 2000, congestionScore: 90 },
        { day: 'Thứ 4', totalTraffic: 9200, cars: 7200, trucks: 2000, congestionScore: 98 },
        { day: 'Thứ 5', totalTraffic: 9100, cars: 7100, trucks: 2000, congestionScore: 96 },
        { day: 'Thứ 6', totalTraffic: 9300, cars: 7300, trucks: 2000, congestionScore: 99 },
        { day: 'Thứ 7', totalTraffic: 8000, cars: 6500, trucks: 1500, congestionScore: 85 },
        { day: 'CN', totalTraffic: 7500, cars: 6000, trucks: 1500, congestionScore: 80 },
    ],
    6: [
        { day: 'Thứ 2', totalTraffic: 4000, cars: 2500, trucks: 1500, congestionScore: 60 },
        { day: 'Thứ 3', totalTraffic: 4200, cars: 2700, trucks: 1500, congestionScore: 62 },
        { day: 'Thứ 4', totalTraffic: 4400, cars: 2900, trucks: 1500, congestionScore: 65 },
        { day: 'Thứ 5', totalTraffic: 4300, cars: 2800, trucks: 1500, congestionScore: 63 },
        { day: 'Thứ 6', totalTraffic: 4500, cars: 3000, trucks: 1500, congestionScore: 68 },
        { day: 'Thứ 7', totalTraffic: 3800, cars: 2300, trucks: 1500, congestionScore: 55 },
        { day: 'CN', totalTraffic: 3600, cars: 2100, trucks: 1500, congestionScore: 50 },
    ],
    7: [
        { day: 'Thứ 2', totalTraffic: 7500, cars: 5500, trucks: 2000, congestionScore: 85 },
        { day: 'Thứ 3', totalTraffic: 7300, cars: 5300, trucks: 2000, congestionScore: 82 },
        { day: 'Thứ 4', totalTraffic: 7700, cars: 5700, trucks: 2000, congestionScore: 88 },
        { day: 'Thứ 5', totalTraffic: 7600, cars: 5600, trucks: 2000, congestionScore: 86 },
        { day: 'Thứ 6', totalTraffic: 7800, cars: 5800, trucks: 2000, congestionScore: 90 },
        { day: 'Thứ 7', totalTraffic: 6500, cars: 5000, trucks: 1500, congestionScore: 75 },
        { day: 'CN', totalTraffic: 6000, cars: 4500, trucks: 1500, congestionScore: 70 },
    ],
    8: [
        { day: 'Thứ 2', totalTraffic: 8500, cars: 6500, trucks: 2000, congestionScore: 90 },
        { day: 'Thứ 3', totalTraffic: 8300, cars: 6300, trucks: 2000, congestionScore: 88 },
        { day: 'Thứ 4', totalTraffic: 8700, cars: 6700, trucks: 2000, congestionScore: 93 },
        { day: 'Thứ 5', totalTraffic: 8600, cars: 6600, trucks: 2000, congestionScore: 91 },
        { day: 'Thứ 6', totalTraffic: 8800, cars: 6800, trucks: 2000, congestionScore: 95 },
        { day: 'Thứ 7', totalTraffic: 7500, cars: 6000, trucks: 1500, congestionScore: 80 },
        { day: 'CN', totalTraffic: 7000, cars: 5500, trucks: 1500, congestionScore: 75 },
    ],
};
const TrafficDashboard = ({ currentCameraId }) => {
    // Get data for the selected camera
    const data = useMemo(() => {
        return mockTrafficData[currentCameraId] || []; // Default to empty array if no data
    }, [currentCameraId]);

    // Data for the pie chart
    const pieData = useMemo(() => {
        const totalCars = data.reduce((sum, item) => sum + item.cars, 0);
        const totalTrucks = data.reduce((sum, item) => sum + item.trucks, 0);
        return [
            { name: 'Ô tô', value: totalCars },
            { name: 'Xe tải', value: totalTrucks },
        ];
    }, [data]);

    return (
        <div className="traffic-dashboard">
            <div className="chart-container">
                <h2>Thống Kê Giao Thông: Camera {currentCameraId || 'Chưa chọn'}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 0.7 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="cars" fill="#8884d8" name="Ô tô" />
                                <Bar yAxisId="left" dataKey="trucks" fill="#82ca9d" name="Xe tải" />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="congestionScore"
                                    stroke="#ff7300"
                                    name="Mức độ ùn tắc"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ flex: 0.3 }}>
                        <h3>Phân Tích Lưu Lượng Xe</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <style>{`
                .traffic-dashboard {
                    padding: 10px;
                    background: #1D253A;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                h2, h3 {
                    color: white;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .chart-container {
                    margin: 20px 0;
                    backgroundColor: '#1D253A';
                }
            `}</style>
        </div>
    );
};

export default React.memo(TrafficDashboard);