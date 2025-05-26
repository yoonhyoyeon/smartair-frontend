import styles from './index.module.css';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import DeviceStatusItem from './DeviceStatusItem';
import { useEffect, useState } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const DeviceStatus = () => {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [devices, setDevices] = useState([]);

    // 방 목록 불러오기
    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetchWithAuth('/api/api/room/rooms');
            const data = await response.json();
            const roomList = Array.isArray(data) ? data : data.content || [];
            setRooms(roomList);
            if (roomList.length > 0) setRoomId(roomList[0].id);
        };
        fetchRooms();
    }, []);

    // 디바이스 목록 불러오기
    useEffect(() => {
        if (!roomId) return;
        const fetchDevices = async () => {
            const response = await fetchWithAuth(`/api/thinq/devices/registered/${roomId}`);
            const data = await response.json();
            console.log(data);
            if(data.length >= 0) setDevices(data);
        };
        fetchDevices();
    }, [roomId]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>기기 현황</h1>
                <IconAlertCircle />
            </div>
            <div className={styles.selectBox}>
                <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                    {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                            {room.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.content}>
                {devices.length === 0 ? (
                    <div>기기가 없습니다.</div>
                ) : (
                    devices.map(device => (
                        <DeviceStatusItem
                            key={device.deviceId}
                            isActive={true}
                            device={device}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default DeviceStatus;