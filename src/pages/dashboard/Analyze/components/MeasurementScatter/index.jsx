import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import styles from './index.module.css';

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

const MeasurementScatter = () => {
    const [xAxis, setXAxis] = useState('temp');
    const [yAxis, setYAxis] = useState('pm2.5');

    const variables = [
        { key: 'pm2.5', label: 'PM2.5', unit: 'μg/m³' },
        { key: 'pm10', label: 'PM10', unit: 'μg/m³' },
        { key: 'co2', label: 'CO2', unit: 'ppm' },
        { key: 'temp', label: '온도', unit: '°C' }
    ];

    const getUnit = (key) => {
        return variables.find(v => v.key === key)?.unit || '';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.axisSelector}>
                    <div className={styles.selector}>
                        <label>X축:</label>
                        <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                            {variables.map(variable => (
                                <option key={variable.key} value={variable.key}>
                                    {variable.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.selector}>
                        <label>Y축:</label>
                        <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                            {variables.map(variable => (
                                <option key={variable.key} value={variable.key}>
                                    {variable.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
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
                        <Scatter
                            name="측정값"
                            data={data}
                            fill="#8884d8"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill='#5382F7'
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MeasurementScatter;