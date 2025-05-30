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
                // try {
                //     const satRes = await fetchWithAuth(`/api/userSatisfaction/${room.id}`);
                //     if (satRes.ok) {
                //         const satData = await satRes.json();
                //         // satData가 배열(최신 7개) → 가장 마지막 값 사용
                //         if (Array.isArray(satData) && satData.length > 0) {
                //             satisfaction = satData[satData.length - 1].satisfaction ?? '-';
                //         }
                //     }
                // } catch {}

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
                                <td>{item.aqi.toFixed(1)}</td>
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