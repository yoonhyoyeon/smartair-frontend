import styles from './index.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
// 24시간 더미 데이터 예시
const data = [
    { time: '00:00', 'pm2.5': 24.8, 'pm10': 30.2, 'co2': 610,  'temp': 22.1 },
    { time: '01:00', 'pm2.5': 25.1, 'pm10': 29.8, 'co2': 620,  'temp': 21.9 },
    { time: '02:00', 'pm2.5': 23.7, 'pm10': 28.5, 'co2': 600,  'temp': 21.7 },
    { time: '03:00', 'pm2.5': 22.4, 'pm10': 27.9, 'co2': 590,  'temp': 21.5 },
    { time: '04:00', 'pm2.5': 21.8, 'pm10': 27.2, 'co2': 580,  'temp': 21.3 },
    { time: '05:00', 'pm2.5': 20.9, 'pm10': 26.8, 'co2': 570,  'temp': 21.2 },
    { time: '06:00', 'pm2.5': 21.2, 'pm10': 27.0, 'co2': 575,  'temp': 21.4 },
    { time: '07:00', 'pm2.5': 22.5, 'pm10': 28.1, 'co2': 590,  'temp': 21.8 },
    { time: '08:00', 'pm2.5': 24.0, 'pm10': 29.5, 'co2': 610,  'temp': 22.3 },
    { time: '09:00', 'pm2.5': 25.3, 'pm10': 30.7, 'co2': 630,  'temp': 22.7 },
    { time: '10:00', 'pm2.5': 26.1, 'pm10': 31.2, 'co2': 650,  'temp': 23.0 },
    { time: '11:00', 'pm2.5': 27.0, 'pm10': 32.0, 'co2': 670,  'temp': 23.4 },
    { time: '12:00', 'pm2.5': 28.2, 'pm10': 33.1, 'co2': 690,  'temp': 23.8 },
    { time: '13:00', 'pm2.5': 29.0, 'pm10': 34.0, 'co2': 710,  'temp': 24.1 },
    { time: '14:00', 'pm2.5': 28.7, 'pm10': 33.7, 'co2': 705,  'temp': 24.0 },
    { time: '15:00', 'pm2.5': 27.9, 'pm10': 32.9, 'co2': 690,  'temp': 23.7 },
    { time: '16:00', 'pm2.5': 26.5, 'pm10': 31.5, 'co2': 670,  'temp': 23.3 },
    { time: '17:00', 'pm2.5': 25.2, 'pm10': 30.1, 'co2': 650,  'temp': 22.9 },
    { time: '18:00', 'pm2.5': 24.0, 'pm10': 29.0, 'co2': 630,  'temp': 22.5 },
    { time: '19:00', 'pm2.5': 23.1, 'pm10': 28.2, 'co2': 615,  'temp': 22.2 },
    { time: '20:00', 'pm2.5': 22.5, 'pm10': 27.7, 'co2': 605,  'temp': 22.0 },
    { time: '21:00', 'pm2.5': 22.0, 'pm10': 27.2, 'co2': 600,  'temp': 21.8 },
    { time: '22:00', 'pm2.5': 21.7, 'pm10': 26.9, 'co2': 595,  'temp': 21.7 },
    { time: '23:00', 'pm2.5': 21.5, 'pm10': 26.7, 'co2': 590,  'temp': 21.6 },
  ];

const MeasurementGraph = () => {
    const [selectedData, setSelectedData] = useState(['co2', 'pm2.5']);
    return (
        <div className={styles.container} onClick={() => setSelectedData(['co2', 'temp', 'pm2.5', 'pm10'])}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}

                >
                    <CartesianGrid stroke="#2F333A" strokeDasharray="3 3" />
                    <XAxis stroke="#E6E6E6" dataKey="time" />
                    <YAxis stroke="#E6E6E6" yAxisId="left" domain={[0, 100]} />
                    <YAxis stroke="#E6E6E6" yAxisId="right" orientation="right" domain={[0, 1000]} />
                    <Tooltip />
                    <Legend />
                    {
                        selectedData.map((dataKey) => (
                            <Line 
                            dot={false} 
                            yAxisId={dataKey === 'co2' ? 'right' : 'left'} 
                            type="monotone" 
                            dataKey={dataKey} 
                            stroke="#5382F7" 
                            strokeWidth={4}
                            />
                        ))
                    }
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MeasurementGraph;