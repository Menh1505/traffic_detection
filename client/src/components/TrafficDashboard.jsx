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
    BarChart,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d'];

const mockTrafficData = {
    1: [
        { day: 'Thứ 2', totalTraffic: 6000, cars: 4000, trucks: 2000, motorbikes: 3000, others: 500, congestionScore: 80 },
        { day: 'Thứ 3', totalTraffic: 5800, cars: 3800, trucks: 2000, motorbikes: 2800, others: 400, congestionScore: 75 },
        { day: 'Thứ 4', totalTraffic: 6200, cars: 4200, trucks: 2000, motorbikes: 3200, others: 600, congestionScore: 85 },
        { day: 'Thứ 5', totalTraffic: 6100, cars: 4100, trucks: 2000, motorbikes: 3100, others: 500, congestionScore: 82 },
        { day: 'Thứ 6', totalTraffic: 6300, cars: 4300, trucks: 2000, motorbikes: 3300, others: 700, congestionScore: 88 },
        { day: 'Thứ 7', totalTraffic: 5000, cars: 3500, trucks: 1500, motorbikes: 2500, others: 300, congestionScore: 70 },
        { day: 'CN', totalTraffic: 4500, cars: 3000, trucks: 1500, motorbikes: 2000, others: 200, congestionScore: 65 },
    ],
    2: [
        { day: 'Thứ 2', totalTraffic: 7000, cars: 5000, trucks: 2000, motorbikes: 4000, others: 600, congestionScore: 85 },
        { day: 'Thứ 3', totalTraffic: 6800, cars: 4800, trucks: 2000, motorbikes: 3800, others: 500, congestionScore: 80 },
        { day: 'Thứ 4', totalTraffic: 7200, cars: 5200, trucks: 2000, motorbikes: 4200, others: 700, congestionScore: 90 },
        { day: 'Thứ 5', totalTraffic: 7100, cars: 5100, trucks: 2000, motorbikes: 4100, others: 600, congestionScore: 87 },
        { day: 'Thứ 6', totalTraffic: 7300, cars: 5300, trucks: 2000, motorbikes: 4300, others: 800, congestionScore: 92 },
        { day: 'Thứ 7', totalTraffic: 6000, cars: 4500, trucks: 1500, motorbikes: 3500, others: 400, congestionScore: 75 },
        { day: 'CN', totalTraffic: 5500, cars: 4000, trucks: 1500, motorbikes: 3000, others: 300, congestionScore: 70 },
    ],
    3: [
        { day: 'Thứ 2', totalTraffic: 8000, cars: 6000, trucks: 2000, motorbikes: 5000, others: 700, congestionScore: 90 },
        { day: 'Thứ 3', totalTraffic: 7800, cars: 5800, trucks: 2000, motorbikes: 4800, others: 600, congestionScore: 85 },
        { day: 'Thứ 4', totalTraffic: 8200, cars: 6200, trucks: 2000, motorbikes: 5200, others: 800, congestionScore: 95 },
        { day: 'Thứ 5', totalTraffic: 8100, cars: 6100, trucks: 2000, motorbikes: 5100, others: 700, congestionScore: 92 },
        { day: 'Thứ 6', totalTraffic: 8300, cars: 6300, trucks: 2000, motorbikes: 5300, others: 900, congestionScore: 97 },
        { day: 'Thứ 7', totalTraffic: 7000, cars: 5500, trucks: 1500, motorbikes: 4500, others: 500, congestionScore: 80 },
        { day: 'CN', totalTraffic: 6500, cars: 5000, trucks: 1500, motorbikes: 4000, others: 400, congestionScore: 75 },
    ],
    4: [
        { day: 'Thứ 2', totalTraffic: 5500, cars: 3500, trucks: 2000, motorbikes: 3000, others: 400, congestionScore: 70 },
        { day: 'Thứ 3', totalTraffic: 5300, cars: 3300, trucks: 2000, motorbikes: 2800, others: 300, congestionScore: 68 },
        { day: 'Thứ 4', totalTraffic: 5700, cars: 3700, trucks: 2000, motorbikes: 3200, others: 500, congestionScore: 75 },
        { day: 'Thứ 5', totalTraffic: 5600, cars: 3600, trucks: 2000, motorbikes: 3100, others: 400, congestionScore: 72 },
        { day: 'Thứ 6', totalTraffic: 5800, cars: 3800, trucks: 2000, motorbikes: 3300, others: 600, congestionScore: 78 },
        { day: 'Thứ 7', totalTraffic: 4800, cars: 3300, trucks: 1500, motorbikes: 2500, others: 300, congestionScore: 65 },
        { day: 'CN', totalTraffic: 4600, cars: 3100, trucks: 1500, motorbikes: 2300, others: 200, congestionScore: 60 },
    ],
    5: [
        { day: 'Thứ 2', totalTraffic: 9000, cars: 7000, trucks: 2000, motorbikes: 6000, others: 800, congestionScore: 95 },
        { day: 'Thứ 3', totalTraffic: 8800, cars: 6800, trucks: 2000, motorbikes: 5800, others: 700, congestionScore: 90 },
        { day: 'Thứ 4', totalTraffic: 9200, cars: 7200, trucks: 2000, motorbikes: 6200, others: 900, congestionScore: 98 },
        { day: 'Thứ 5', totalTraffic: 9100, cars: 7100, trucks: 2000, motorbikes: 6100, others: 800, congestionScore: 96 },
        { day: 'Thứ 6', totalTraffic: 9300, cars: 7300, trucks: 2000, motorbikes: 6300, others: 1000, congestionScore: 99 },
        { day: 'Thứ 7', totalTraffic: 8000, cars: 6500, trucks: 1500, motorbikes: 5500, others: 600, congestionScore: 85 },
        { day: 'CN', totalTraffic: 7500, cars: 6000, trucks: 1500, motorbikes: 5000, others: 500, congestionScore: 80 },
    ],
    6: [
        { day: 'Thứ 2', totalTraffic: 4000, cars: 2500, trucks: 1500, motorbikes: 2000, others: 300, congestionScore: 60 },
        { day: 'Thứ 3', totalTraffic: 4200, cars: 2700, trucks: 1500, motorbikes: 2200, others: 400, congestionScore: 62 },
        { day: 'Thứ 4', totalTraffic: 4400, cars: 2900, trucks: 1500, motorbikes: 2400, others: 500, congestionScore: 65 },
        { day: 'Thứ 5', totalTraffic: 4300, cars: 2800, trucks: 1500, motorbikes: 2300, others: 400, congestionScore: 63 },
        { day: 'Thứ 6', totalTraffic: 4500, cars: 3000, trucks: 1500, motorbikes: 2500, others: 600, congestionScore: 68 },
        { day: 'Thứ 7', totalTraffic: 3800, cars: 2300, trucks: 1500, motorbikes: 1800, others: 200, congestionScore: 55 },
        { day: 'CN', totalTraffic: 3600, cars: 2100, trucks: 1500, motorbikes: 1600, others: 100, congestionScore: 50 },
    ],
    7: [
        { day: 'Thứ 2', totalTraffic: 7500, cars: 5500, trucks: 2000, motorbikes: 4500, others: 600, congestionScore: 85 },
        { day: 'Thứ 3', totalTraffic: 7300, cars: 5300, trucks: 2000, motorbikes: 4300, others: 500, congestionScore: 82 },
        { day: 'Thứ 4', totalTraffic: 7700, cars: 5700, trucks: 2000, motorbikes: 4700, others: 700, congestionScore: 88 },
        { day: 'Thứ 5', totalTraffic: 7600, cars: 5600, trucks: 2000, motorbikes: 4600, others: 600, congestionScore: 86 },
        { day: 'Thứ 6', totalTraffic: 7800, cars: 5800, trucks: 2000, motorbikes: 4800, others: 800, congestionScore: 90 },
        { day: 'Thứ 7', totalTraffic: 6500, cars: 5000, trucks: 1500, motorbikes: 4000, others: 400, congestionScore: 75 },
        { day: 'CN', totalTraffic: 6000, cars: 4500, trucks: 1500, motorbikes: 3500, others: 300, congestionScore: 70 },
    ],
    8: [
        { day: 'Thứ 2', totalTraffic: 8500, cars: 6500, trucks: 2000, motorbikes: 5500, others: 700, congestionScore: 90 },
        { day: 'Thứ 3', totalTraffic: 8300, cars: 6300, trucks: 2000, motorbikes: 5300, others: 600, congestionScore: 88 },
        { day: 'Thứ 4', totalTraffic: 8700, cars: 6700, trucks: 2000, motorbikes: 5700, others: 800, congestionScore: 93 },
        { day: 'Thứ 5', totalTraffic: 8600, cars: 6600, trucks: 2000, motorbikes: 5600, others: 700, congestionScore: 91 },
        { day: 'Thứ 6', totalTraffic: 8800, cars: 6800, trucks: 2000, motorbikes: 5800, others: 900, congestionScore: 95 },
        { day: 'Thứ 7', totalTraffic: 7500, cars: 6000, trucks: 1500, motorbikes: 5000, others: 500, congestionScore: 80 },
        { day: 'CN', totalTraffic: 7000, cars: 5500, trucks: 1500, motorbikes: 4500, others: 400, congestionScore: 75 },
    ],
};

const mockTrafficByTime = {
    1: [
        { time: '6h-7h', traffic: 25 },
        { time: '8h-9h', traffic: 60 },
        { time: '10h-12h', traffic: 45 },
        { time: '13h-15h', traffic: 30 },
        { time: '16h-18h', traffic: 70 },
    ],
    2: [
        { time: '6h-7h', traffic: 30 },
        { time: '8h-9h', traffic: 55 },
        { time: '10h-12h', traffic: 40 },
        { time: '13h-15h', traffic: 25 },
        { time: '16h-18h', traffic: 65 },
    ],
    3: [
        { time: '6h-7h', traffic: 20 },
        { time: '8h-9h', traffic: 65 },
        { time: '10h-12h', traffic: 50 },
        { time: '13h-15h', traffic: 35 },
        { time: '16h-18h', traffic: 75 },
    ],
    4: [
        { time: '6h-7h', traffic: 22 },
        { time: '8h-9h', traffic: 58 },
        { time: '10h-12h', traffic: 42 },
        { time: '13h-15h', traffic: 28 },
        { time: '16h-18h', traffic: 68 },
    ],
    5: [
        { time: '6h-7h', traffic: 27 },
        { time: '8h-9h', traffic: 62 },
        { time: '10h-12h', traffic: 47 },
        { time: '13h-15h', traffic: 32 },
        { time: '16h-18h', traffic: 72 },
    ],
    6: [
        { time: '6h-7h', traffic: 24 },
        { time: '8h-9h', traffic: 59 },
        { time: '10h-12h', traffic: 44 },
        { time: '13h-15h', traffic: 29 },
        { time: '16h-18h', traffic: 69 },
    ],
    7: [
        { time: '6h-7h', traffic: 26 },
        { time: '8h-9h', traffic: 63 },
        { time: '10h-12h', traffic: 46 },
        { time: '13h-15h', traffic: 31 },
        { time: '16h-18h', traffic: 71 },
    ],
    8: [
        { time: '6h-7h', traffic: 23 },
        { time: '8h-9h', traffic: 57 },
        { time: '10h-12h', traffic: 43 },
        { time: '13h-15h', traffic: 27 },
        { time: '16h-18h', traffic: 67 },
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
        const totalMotorbikes = data.reduce((sum, item) => sum + item.motorbikes, 0);
        const totalOthers = data.reduce((sum, item) => sum + item.others, 0);
        return [
            { name: 'Ô tô', value: totalCars },
            { name: 'Xe tải', value: totalTrucks },
            { name: 'Xe máy', value: totalMotorbikes },
            { name: 'Loại khác', value: totalOthers },
        ];
    }, [data]);

    // Data for traffic by time of day
    const trafficByTimeData = useMemo(() => {
        return mockTrafficByTime[currentCameraId] || [];
    }, [currentCameraId]);

    return (
        <div className="traffic-dashboard">
            <div className="chart-container">
                <h2>Thống Kê Giao Thông: Camera {currentCameraId || 'Chưa chọn'}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Chart 1: Composed Chart */}
                    <div style={{ flex: 0.33, height: '250px' }}>
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
    <Bar yAxisId="left" dataKey="motorbikes" fill="#ffc658" name="Xe máy" />
    <Bar yAxisId="left" dataKey="others" fill="#d0ed57" name="Loại khác" />
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

                    {/* Chart 2: Pie Chart */}
                    <div style={{ flex: 0.33, height: '200px' }}>
                        <h3>Phân Tích Lưu Lượng Xe</h3>
                        <ResponsiveContainer width="100%" height="100%">
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

                    {/* Chart 3: Traffic by Time of Day */}
                    <div style={{ flex: 0.33, height: '200px' }}>
                        <h3>Phân Tích Lưu Lượng Theo Thời Gian</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficByTimeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="traffic" fill="#82ca9d" name="Lưu lượng xe" />
                            </BarChart>
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