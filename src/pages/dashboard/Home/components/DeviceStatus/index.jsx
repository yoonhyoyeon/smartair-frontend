import styles from './index.module.css';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import DeviceStatusItem from './DeviceStatusItem';
import { useEffect, useState } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const DeviceStatus = () => {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [devices, setDevices] = useState([]);

    const dummyDevices = [
        {
            deviceId: 1,
            alias: '에어컨',
            deviceType: '에어컨',
            name: 'LG 에어컨'
        },
        {
            deviceId: 2,
            alias: '공기청정기',
            deviceType: '공기청정기',
            name: '비스타 공기청정기'
        }
    ];

    const dummyRooms = [
        { id: 'dummy-room-1', name: '방 1' },
        { id: 'dummy-room-2', name: '방 2' }
    ];

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
                    setRoomId((roomList.length > 0 ? roomList : dummyRooms)[0].id);
            } catch (e) {
                console.error(e);
                setRooms(dummyRooms);
                setRoomId(dummyRooms[0].id);
            }
        };
        fetchRooms();
    }, []);

    // 디바이스 목록 불러오기
    useEffect(() => {
        if (!roomId) return;
        const fetchDevices = async () => {
            try {
                const response = await fetchWithAuth(`/api/thinq/devices/registered/${roomId}`);
                if (!response.ok) throw new Error('API 실패');
                const data = await response.json();
                if(Array.isArray(data)) setDevices(data);
                else setDevices([]);
            } catch (e) {
                console.error(e);
                setDevices(dummyDevices); // 실패 시 더미 데이터 사용
            }
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