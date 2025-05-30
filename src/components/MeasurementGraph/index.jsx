import styles from './index.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useRef } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const variables = [
    { key: 'hourlyAvgPm25', label: 'PM2.5', color: '#5382F7', yAxisId: 'left' },
    { key: 'hourlyAvgPm10', label: 'PM10', color: '#FF8042', yAxisId: 'left' },
    { key: 'hourlyAvgEco2', label: 'CO2', color: '#82ca9d', yAxisId: 'right' },
    { key: 'hourlyAvgTvoc', label: 'TVOC', color: '#8884d8', yAxisId: 'left' },
    { key: 'hourlyAvgTemperature', label: '온도(℃)', color: '#F7B801', yAxisId: 'left' },
    { key: 'hourlyAvgHumidity', label: '습도(%)', color: '#00C49F', yAxisId: 'left' },
    { key: 'hourlyAvgPressure', label: '기압(hPa)', color: '#00C49F', yAxisId: 'right' },
    // 필요시 추가
];

const MeasurementGraph = ({ serialNumber }) => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(variables.map(v => v.key));
    const [loading, setLoading] = useState(false);
    const allSelected = selectedData.length === variables.length;
    const someSelected = selectedData.length > 0 && selectedData.length < variables.length;
    const allCheckboxRef = useRef(null);

    // 체크박스 핸들러
    const handleCheckboxChange = (key) => {
        setSelectedData(prev =>
            prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
        );
    };

    useEffect(() => {
        if (allCheckboxRef.current) {
            allCheckboxRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

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
                        label: date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
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
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            ref={allCheckboxRef}
                            checked={allSelected}
                            onChange={e => {
                                if (e.target.checked) {
                                    setSelectedData(variables.map(v => v.key));
                                } else {
                                    setSelectedData([]);
                                }
                            }}
                        />
                        <span className={styles.checkboxLabel}>전체 선택</span>
                    </label>
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
                            <Tooltip 
                                formatter={(value, name) => {
                                    const variable = variables.find(v => v.key === name);
                                    const unit = variable?.unit ? ` (${variable.unit})` : '';
                                    return [Number(value).toFixed(2), `${variable?.label || name}${unit}`];
                                }}
                            />
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