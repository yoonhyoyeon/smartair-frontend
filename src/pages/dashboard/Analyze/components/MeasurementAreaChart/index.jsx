import styles from './index.module.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;

const variables = [
    { key: 'pm2.5', label: 'PM2.5', color: '#ffc658', unit: 'μg/m³' },
    { key: 'pm10', label: 'PM10', color: '#ff8042', unit: 'μg/m³' },
    { key: 'co2', label: 'CO2', color: '#8884d8', unit: 'ppm' },
    { key: 'temp', label: '온도', color: '#82ca9d', unit: '°C' }
];

const MeasurementAreaChart = () => {
    const [selectedData, setSelectedData] = useState(['co2', 'pm2.5', 'temp', 'pm10']);

    const handleCheckboxChange = (key) => {
        setSelectedData(prev => {
            if (prev.includes(key)) {
                return prev.filter(item => item !== key);
            } else {
                return [...prev, key];
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.checkboxGroup}>
                    {variables.map(variable => (
                        <label key={variable.key} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={selectedData.includes(variable.key)}
                                onChange={() => handleCheckboxChange(variable.key)}
                            />
                            <span className={styles.checkboxLabel}>
                                {variable.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        stackOffset="expand"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis tickFormatter={toPercent} />
                        <Tooltip
                            formatter={(value, name) => {
                                const variable = variables.find(v => v.key === name);
                                return [value, `${variable?.label} (${variable?.unit})`];
                            }}
                        />
                        {selectedData.map(key => {
                            const variable = variables.find(v => v.key === key);
                            return (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stackId="1"
                                    stroke={variable.color}
                                    fill={variable.color}
                                />
                            );
                        })}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MeasurementAreaChart;