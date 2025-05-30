import styles from './index.module.css';
import MeasurementCards from '@/components/MeasurementCards';
import MeasurementGraph from '@/components/MeasurementGraph';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import { useState, useEffect } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const SensorMeasurement = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [sensors, setSensors] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState('');
    const [measurement, setMeasurement] = useState(null);

    // 방 목록 불러오기
    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetchWithAuth('/api/api/room/rooms');
            const data = await response.json();
            const roomList = Array.isArray(data) ? data : data.content || [];
            setRooms(roomList);
            if (roomList.length > 0) setSelectedRoom(roomList[0].id);
        };
        fetchRooms();
    }, []);

    // 방 선택 시 센서(디바이스) 목록 불러오기
    useEffect(() => {
        if (!selectedRoom) return;
        const fetchSensors = async () => {
            const response = await fetchWithAuth(`/api/api/room/${selectedRoom}/sensors`);
            const data = await response.json();
            setSensors(data);
            if (data.length > 0) setSelectedSensor(data[0].serialNumber || data[0].deviceId);
        };
        fetchSensors();
    }, [selectedRoom]);

    // 센서 선택 시 측정값 불러오기 (2초마다 polling)
    useEffect(() => {
        if (!selectedSensor) {
            setMeasurement(null);
            return;
        }
        let timerId;
        const fetchMeasurement = async () => {
            const response = await fetchWithAuth(`/api/api/snapshots/latest/${selectedSensor}`);
            const data = await response.json();
            console.log('latest data', data);
            setMeasurement(data);
        };
        fetchMeasurement(); // 최초 1회
        timerId = setInterval(fetchMeasurement, 2000);
        return () => clearInterval(timerId);
    }, [selectedSensor]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>센서 측정값</h1>
                <IconAlertCircle />
            </div>
            <div className={styles.select_area}>
                <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                    {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                            {room.name}
                        </option>
                    ))}
                </select>
                <select value={selectedSensor} onChange={(e) => setSelectedSensor(e.target.value)}>
                    {sensors.map(sensor => (
                        <option key={sensor.serialNumber || sensor.deviceId} value={sensor.serialNumber || sensor.deviceId}>
                            {sensor.name || sensor.alias || sensor.serialNumber || sensor.deviceId}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.content}>
                <div className={styles.left}>
                    <MeasurementCards measurement={measurement} />
                </div>
                <div className={styles.right}>
                    <MeasurementGraph serialNumber={selectedSensor} />
                </div>
            </div>
        </div>
    );
};

export default SensorMeasurement;