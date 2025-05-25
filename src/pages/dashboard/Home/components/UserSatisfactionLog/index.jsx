import styles from './index.module.css';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import IconArrowRightCircle from '@/assets/images/IconArrowRightCircle.svg?react';
import { useEffect, useState } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const UserSatisfactionLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            // 1. 방 목록 불러오기
            const roomsRes = await fetchWithAuth('api/api/room/rooms');
            const roomsData = await roomsRes.json();
            const rooms = Array.isArray(roomsData) ? roomsData : roomsData.content || [];

            // 2. 각 방의 만족도, AQI 병렬 fetch
            const logPromises = rooms.map(async (room) => {
                // 만족도
                let satisfaction = '-';
                try {
                    const satRes = await fetch(`/api/userSatisfaction/${room.id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                            }
                        }
                    );
                    if (satRes.ok) {
                        const satData = await satRes.json();
                        satisfaction = satData.satisfaction ?? '-';
                    }
                } catch {}

                // AQI
                let aqi = '-';
                try {
                    const aqiRes = await fetchWithAuth(`/api/api/scores/room/${room.id}/latest`);
                    if (aqiRes.ok) {
                        const aqiData = await aqiRes.json();
                        aqi = aqiData.overallScore ?? '-';
                    }
                } catch {}

                return {
                    roomName: room.name,
                    aqi,
                    satisfaction
                };
            });

            const logs = await Promise.all(logPromises);
            setLogs(logs);
            setLoading(false);
        };

        fetchLogs();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>사용자 만족도 로그</h1>
                <IconAlertCircle />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>방 이름</th>
                        <th>AQI</th>
                        <th>만족도(%)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4}>로딩 중...</td>
                        </tr>
                    ) : (
                        logs.map((item) => (
                            <tr key={item.roomName}>
                                <td>{item.roomName}</td>
                                <td>{item.aqi}</td>
                                <td>{item.satisfaction}</td>
                                <td><IconArrowRightCircle /></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserSatisfactionLog;