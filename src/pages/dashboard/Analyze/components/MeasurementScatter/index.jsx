import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import styles from './index.module.css';
import fetchWithAuth from '@/api/fetchWithAuth';

const variables = [
    { key: 'hourlyAvgPm25', label: 'PM2.5', unit: 'μg/m³' },
    { key: 'hourlyAvgPm10', label: 'PM10', unit: 'μg/m³' },
    { key: 'hourlyAvgEco2', label: 'CO2', unit: 'ppm' },
    { key: 'hourlyAvgTvoc', label: 'TVOC', unit: 'ppb' },
    { key: 'hourlyAvgTemperature', label: '온도', unit: '°C' },
    { key: 'hourlyAvgHumidity', label: '습도', unit: '%' },
    { key: 'hourlyAvgPressure', label: '기압', unit: 'hPa' },
];

const getUnit = (key) => variables.find(v => v.key === key)?.unit || '';

const MeasurementScatter = ({ serialNumber, startTime, endTime }) => {
    const [xAxis, setXAxis] = useState('hourlyAvgTemperature');
    const [yAxis, setYAxis] = useState('hourlyAvgPm25');
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
                setData(arr);
                console.log(arr);
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    }, [serialNumber, startTime, endTime]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.axisSelector}>
                    <div className={styles.selector}>
                        <label>X축:</label>
                        <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
                            {variables.map(v => (
                                <option key={v.key} value={v.key}>{v.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.selector}>
                        <label>Y축:</label>
                        <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
                            {variables.map(v => (
                                <option key={v.key} value={v.key}>{v.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className={styles.chartContainer}>
                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis
                                type="number"
                                dataKey={xAxis}
                                name={variables.find(v => v.key === xAxis)?.label}
                                unit={getUnit(xAxis)}
                                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                            />
                            <YAxis
                                type="number"
                                dataKey={yAxis}
                                name={variables.find(v => v.key === yAxis)?.label}
                                unit={getUnit(yAxis)}
                                domain={['dataMin - 1', 'dataMax + 1']}
                            />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                formatter={(value, name) => {
                                    const unit = getUnit(name);
                                    return [value, `${name} (${unit})`];
                                }}
                            />
                            <Scatter name="측정값" data={data} fill="#5382F7">
                                {data.map((entry, idx) => (
                                    <Cell key={idx} fill="#5382F7" />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default MeasurementScatter;