// src/components/TrafficDashboard.tsx
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
} from 'recharts';

interface TrafficData {
    day: string;
    totalTraffic: number;
    cars: number;
    trucks: number;
    congestionScore: number;
}

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

    return (
        <div className="traffic-dashboard">
            <h2>Thống Kê Giao Thông Theo Tuần</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={500}>
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

            <style>{`
        .traffic-dashboard {
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }

        .chart-container {
          margin: 20px 0;
          height: 500px;
        }
      `}</style>
        </div>
    );
};

export default React.memo(TrafficDashboard);
