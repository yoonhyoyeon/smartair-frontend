import styles from './index.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const variables = [
    { key: 'pm25Score', label: 'PM2.5 점수', color: '#5382F7', yAxisId: 'left' },
    { key: 'pm10Score', label: 'PM10 점수', color: '#FF8042', yAxisId: 'left' },
    { key: 'eco2Score', label: 'CO2 점수', color: '#82ca9d', yAxisId: 'right' },
    { key: 'tvocScore', label: 'TVOC 점수', color: '#8884d8', yAxisId: 'right' },
    { key: 'hourlyAvgTemperature', label: '온도(℃)', color: '#F7B801', yAxisId: 'left' },
    { key: 'hourlyAvgHumidity', label: '습도(%)', color: '#00C49F', yAxisId: 'left' },
    // 필요시 추가
];

function getLast24Hours() {
    const arr = [];
    const now = new Date();
    now.setMinutes(0, 0, 0);
    for (let i = 23; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(now.getHours() - i);
        arr.push({
            label: d.getHours().toString().padStart(2, '0') + ':00',
            snapshotHour: d.toISOString().slice(0, 19)
        });
    }
    return arr;
}

const MeasurementGraph = ({ serialNumber }) => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(variables.map(v => v.key));
    const [loading, setLoading] = useState(false);

    // 체크박스 핸들러
    const handleCheckboxChange = (key) => {
        setSelectedData(prev =>
            prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
        );
    };

    useEffect(() => {
        if (!serialNumber) return;
        setLoading(true);
        const hours = getLast24Hours();
        Promise.all(
            hours.map(async ({ label, snapshotHour }) => {
                const response = await fetchWithAuth(`/api/api/snapshots/${serialNumber}/${snapshotHour}`);
                if (!response.ok) return { label, snapshotHour, error: true };
                const result = await response.json();
                // result가 HourlySensorAirQualitySnapshotResponse 객체라고 가정
                return { label, snapshotHour, ...result };
            })
        ).then(results => {
            setData(results);
            setLoading(false);
        });
    }, [serialNumber]);

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
                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid stroke="#2F333A" strokeDasharray="3 3" />
                            <XAxis stroke="#E6E6E6" dataKey="label" />
                            <YAxis stroke="#E6E6E6" yAxisId="left" />
                            <YAxis stroke="#E6E6E6" yAxisId="right" orientation="right" />
                            <Tooltip />
                            {selectedData.map(key => {
                                const variable = variables.find(v => v.key === key);
                                return (
                                    <Line
                                        key={key}
                                        dot={false}
                                        yAxisId={variable.yAxisId}
                                        type="monotone"
                                        dataKey={key}
                                        stroke={variable.color}
                                        strokeWidth={2}
                                    />
                                );
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default MeasurementGraph;