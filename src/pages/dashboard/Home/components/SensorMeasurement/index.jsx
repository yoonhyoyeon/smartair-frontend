import styles from './index.module.css';
import MeasurementCards from '@/components/MeasurementCards';
import MeasurementGraph from '@/components/MeasurementGraph';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import { useState } from 'react';

const SensorMeasurement = () => {
    const [selectedDevice, setSelectedDevice] = useState('All');
    const [selectedDate, setSelectedDate] = useState('RealTime');
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>센서 측정값</h1>
                <IconAlertCircle />
            </div>
            <div className={styles.select_area}>
                <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
                    <option value="All">All Devices</option>
                    <option value="Device1">Device1</option>
                    <option value="Device2">Device2</option>
                    <option value="Device3">Device3</option>
                </select>
                <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                    <option value="RealTime">Real Time</option>
                    <option value="15m">Last 15m</option>
                    <option value="1h">Last 1h</option>
                    <option value="4h">Last 4h</option>
                    <option value="24h">Last 24h</option>
                    <option value="1week">Last 1 week</option>
                    <option value="1month">Last 1 month</option>
                </select>
            </div>
            <div className={styles.content}>
                <div className={styles.left}>
                    <MeasurementCards />
                </div>
                <div className={styles.right}>
                    <MeasurementGraph />
                </div>
            </div>
        </div>
    );
};

export default SensorMeasurement;