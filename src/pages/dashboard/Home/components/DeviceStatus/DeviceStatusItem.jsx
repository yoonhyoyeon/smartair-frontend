import styles from './index.module.css';
import IconPower from '@/assets/images/IconPower.svg?react';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const DeviceStatusItem = ({ device }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!device?.deviceId) return;
        const fetchStatus = async () => {
            try {
                const res = await fetchWithAuth(`/api/thinq/status/${device.deviceId}`);
                if (res.ok) {
                    const data = await res.json();
                    // 예시: POWER_ON, POWER_OFF 등
                    console.log(data);
                    const powerStatus = data?.response?.operation?.airFanOperationMode;
                    setIsActive(powerStatus === 'POWER_ON');
                } else {
                    setIsActive(false);
                }
            } catch {
                setIsActive(false);
            }
        };
        fetchStatus();
    }, [device?.deviceId]);

    return (
        <div className={cx(styles.DeviceStatusItem, isActive && styles.active)}>
            <div className={styles.power}>
                <IconPower className={styles.powerIcon} />
            </div>
            <span className={styles.name}>{device?.name || device?.alias || '기기 이름'}</span>
            <span className={styles.type}>{device?.deviceType || '기기 종류'}</span>
        </div>
    );
};

export default DeviceStatusItem;