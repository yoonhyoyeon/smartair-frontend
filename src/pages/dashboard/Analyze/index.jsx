import styles from './index.module.css';
import MeasurementCards from '@/components/MeasurementCards';
import MeasurementGraph from '@/components/MeasurementGraph';
import MeasurementScatter from './components/MeasurementScatter';
import MeasurementAreaChart from './components/MeasurementAreaChart';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import { useState, useEffect } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const DashboardAnalyze = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [sensors, setSensors] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState('');
    const [measurement, setMeasurement] = useState(null);

    const dummyRooms = [
      { id: 'dummy-room-1', name: '방 1' },
      { id: 'dummy-room-2', name: '방 2' }
    ];
    const dummySensors = [
      { serialNumber: 'dummy-sensor-1', name: '센서 1' },
      { serialNumber: 'dummy-sensor-2', name: '센서 2' }
    ];
    const dummyMeasurement = {
      temperature: 23.5,
      humidity: 70,
      pressure: 1310,
      eco2: 480,
      tvoc: 150,
      rawh2: 60,
      rawethanol: 80,
      pt1_pm10_standard: 12,
      pt1_pm25_standard: 8,
      pt2_pm10_standard: 10,
      pt2_pm25_standard: 19,
    };

    // 방 목록 불러오기
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetchWithAuth('/api/api/room/rooms');
                if (!response.ok) throw new Error('API 실패');
                const data = await response.json();
                const roomList = Array.isArray(data) ? data : data.content || [];
                setRooms(roomList.length > 0 ? roomList : dummyRooms);
                if ((roomList.length > 0 ? roomList : dummyRooms).length > 0)
                    setSelectedRoom((roomList.length > 0 ? roomList : dummyRooms)[0].id);
            } catch (e) {
                console.error(e);
                setRooms(dummyRooms);
                setSelectedRoom(dummyRooms[0].id);
            }
        };
        fetchRooms();
    }, []);

    // 방 선택 시 센서(디바이스) 목록 불러오기
    useEffect(() => {
        if (!selectedRoom) return;
        const fetchSensors = async () => {
            try {
                const response = await fetchWithAuth(`/api/api/room/${selectedRoom}/sensors`);
                if (!response.ok) throw new Error('API 실패');
                const data = await response.json();
                setSensors(data.length > 0 ? data : dummySensors);
                if ((data.length > 0 ? data : dummySensors).length > 0)
                    setSelectedSensor((data.length > 0 ? data : dummySensors)[0].serialNumber || (data.length > 0 ? data : dummySensors)[0].deviceId);
            } catch (e) {
                console.error(e);
                setSensors(dummySensors);
                setSelectedSensor(dummySensors[0].serialNumber);
            }
        };
        fetchSensors();
    }, [selectedRoom]);

    // 센서 선택 시 측정값 불러오기
    useEffect(() => {
        if (!selectedSensor) {
            setMeasurement(null);
            return;
        }
        const fetchMeasurement = async () => {
            try {
                const response = await fetchWithAuth(`api/api/snapshots/latest/${selectedSensor}`);
                if (!response.ok) throw new Error('API 실패');
                const data = await response.json();
                setMeasurement(data);
            } catch (e) {
                console.error(e);
                setMeasurement(dummyMeasurement);
            }
        };
        fetchMeasurement();
    }, [selectedSensor]);
    


    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.itemWrapper}>
                    <div className={styles.header}>
                        <h1>측정값</h1>
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
                    <MeasurementCards measurement={measurement} />
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.header}>
                        <h1>변화</h1>
                        <IconAlertCircle />
                    </div>
                    <MeasurementGraph serialNumber={selectedSensor} />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.itemWrapper}>
                    <div className={styles.header}>
                        <h1>상관관계</h1>
                        <IconAlertCircle />
                    </div>
                    <MeasurementScatter serialNumber={selectedSensor} />
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.header}>
                        <h1>비율</h1>
                        <IconAlertCircle />
                    </div>
                    <MeasurementAreaChart serialNumber={selectedSensor} />
                </div>
            </div>
        </div>
    )
}
export default DashboardAnalyze;