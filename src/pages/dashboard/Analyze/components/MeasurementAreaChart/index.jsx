import styles from './index.module.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const variables = [
    { key: 'hourlyAvgPm25', label: 'PM2.5', color: '#ffc658', unit: 'μg/m³' },
    { key: 'hourlyAvgPm10', label: 'PM10', color: '#ff8042', unit: 'μg/m³' },
    { key: 'hourlyAvgEco2', label: 'CO2', color: '#8884d8', unit: 'ppm' },
    { key: 'hourlyAvgTvoc', label: 'TVOC', color: '#82ca9d', unit: 'ppb' }
];

const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;

const MeasurementAreaChart = ({ serialNumber, startTime, endTime }) => {
    const [selectedData, setSelectedData] = useState(variables.map(v => v.key));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!serialNumber) return;
        setLoading(true);
        let start = startTime, end = endTime;
        if (!start || !end) {
            const now = new Date();
            const endDate = new Date(now);
            endDate.setMinutes(0, 0, 0);
            end = endDate.toISOString().slice(0, 19);
            const startDate = new Date(endDate);
            startDate.setHours(endDate.getHours() - 100);
            start = startDate.toISOString().slice(0, 19);
        }
        fetchWithAuth(`/api/api/snapshots/${serialNumber}/${start}/${end}`)
            .then(async res => {
                if (!res.ok) throw new Error('데이터 조회 실패');
                const arr = await res.json();
                // label(시각) 필드 추가
                const processed = arr.map(item => {
                    const date = new Date(item.snapshotHour);
                    return {
                        ...item,
                        time: date.getHours().toString().padStart(2, '0') + ':00'
                    };
                });
                setData(processed);
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    }, [serialNumber, startTime, endTime]);

    const handleCheckboxChange = (key) => {
        setSelectedData(prev =>
            prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
        );
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
                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : (
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
                                    return [toPercent(value), `${variable?.label} (${variable?.unit})`];
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
                )}
            </div>
        </div>
    );
};

export default MeasurementAreaChart;