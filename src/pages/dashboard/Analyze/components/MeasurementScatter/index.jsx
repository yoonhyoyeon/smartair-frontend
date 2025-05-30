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

const MeasurementScatter = ({ serialNumber }) => {
    const [xAxis, setXAxis] = useState('hourlyAvgTemperature');
    const [yAxis, setYAxis] = useState('hourlyAvgPm25');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!serialNumber) return;
        setLoading(true);
        // 최근 24시간 구간 계산
        const offset = new Date().getTimezoneOffset() * 60000;
        const end = new Date(Date.now() - offset);
        const endTime = end.toISOString().slice(0, 19);
        const start = new Date(end);
        start.setHours(end.getHours() - 24); // 24시간 전
        const startTime = start.toISOString().slice(0, 19);

        fetchWithAuth(`/api/api/snapshots/${serialNumber}?startTime=${startTime}&endTime=${endTime}`)
            .then(async response => {
                if (!response.ok) throw new Error('데이터 조회 실패');
                const result = await response.json();
                // result가 배열(시간별 스냅샷)이라고 가정
                // label(시, 예: 14:00) 필드 추가
                console.log(startTime, endTime, result);
                const dataWithLabel = result.map(item => {
                    const date = new Date(item.snapshotHour);
                    return {
                        ...item,
                        time: date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                    };
                });
                setData(dataWithLabel);
            })
            .catch((error) => {
                console.error('데이터 조회 실패:', error);
                setData([]);
            })
            .finally(() => setLoading(false));
    }, [serialNumber]);

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
                                formatter={(value, name) => {
                                    const variable = variables.find(v => v.key === name);
                                    const unit = variable?.unit ? ` (${variable.unit})` : '';
                                    return [Number(value).toFixed(2), `${variable?.label || name}${unit}`];
                                }}
                                cursor={{ strokeDasharray: '3 3' }}
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