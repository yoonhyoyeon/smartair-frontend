import styles from './index.module.css';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import DeviceStatusItem from './DeviceStatusItem';
import { useEffect, useState } from 'react';

const DeviceStatus = () => {
    const [data, setData] = useState([]);
    const [roomId, setRoomId] = useState(817);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/thinq/devices/${roomId}`);
            const data = await response.json();
            setData(data);
            console.log(data);
        };
        fetchData();
    }, [roomId]);
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>기기 현황</h1>
                <IconAlertCircle />
            </div>
            <div className={styles.selectBox}>
                <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                    <option value="817">817</option>
                    <option value="818">818</option>
                    <option value="819">819</option>
                    <option value="820">820</option>
                </select>
            </div>
            <div className={styles.content}>
                <DeviceStatusItem isActive={true}/>
                <DeviceStatusItem />
                <DeviceStatusItem />
                <DeviceStatusItem />
                <DeviceStatusItem />
                <DeviceStatusItem />
                <DeviceStatusItem />
                <DeviceStatusItem />
                <DeviceStatusItem />
            </div>
        </div>
    );
};

export default DeviceStatus;