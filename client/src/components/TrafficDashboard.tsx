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

interface TrafficData {
    day: string;
    totalTraffic: number;
    cars: number;
    trucks: number;
    congestionScore: number;
}

const COLORS = ['#8884d8', '#82ca9d'];

const TrafficDashboard: React.FC = () => {
    // Tạo dữ liệu mẫu
    const data: TrafficData[] = useMemo(() => {
        const generateData = (): TrafficData[] => {
            return Array.from({ length: 7 }, (_, index) => ({
                day: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'][index],
                totalTraffic: Math.floor(Math.random() * 3000) + 5000,
                cars: Math.floor(Math.random() * 2000) + 3000,
                trucks: Math.floor(Math.random() * 500) + 500,
                congestionScore: Math.floor(Math.random() * 40) + 60,
            }));
        };
        return generateData();
    }, []);

    // Dữ liệu cho biểu đồ tròn
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
            <h2>Thống Kê Giao Thông Theo Tuần</h2>
            <div className="chart-container">
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
                }
            `}</style>
        </div>
    );
};

export default React.memo(TrafficDashboard);
