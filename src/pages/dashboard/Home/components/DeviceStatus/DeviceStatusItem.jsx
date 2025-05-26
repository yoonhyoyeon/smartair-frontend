import styles from './index.module.css';
import IconPower from '@/assets/images/IconPower.svg?react';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import fetchWithAuth from '@/api/fetchWithAuth';

const DeviceStatusItem = ({ device }) => {
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!device?.deviceId) return;
        const fetchStatus = async () => {
            try {
                const res = await fetchWithAuth(`/api/thinq/status/${device.deviceId}`);
                if (res.ok) {
                    const data = await res.json();
                    // 예시: POWER_ON, POWER_OFF 등
                    console.log(device.deviceId, data);
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

    // 전원 토글 핸들러
    const handleTogglePower = async () => {
        if (loading || !device?.deviceId) return;
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/api/thinq/power/${device.deviceId}`, {
                method: 'POST',
            });
            if (res.ok) {
                setIsActive(prev => !prev); // 성공 시 상태 반전
            } else {
                alert('전원 제어 실패');
            }
        } catch {
            alert('전원 제어 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={cx(styles.DeviceStatusItem, isActive && styles.active, loading && styles.loading)}
            onClick={handleTogglePower}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            title={loading ? '처리 중...' : isActive ? '전원 끄기' : '전원 켜기'}
        >
            <div className={styles.power}>
                <IconPower className={styles.powerIcon} />
            </div>
            <span className={styles.name}>{device?.name || device?.alias || '기기 이름'}</span>
            <span className={styles.type}>{loading ? '처리 중...' : isActive ? '전원 켜짐' : '전원 꺼짐'}</span>
        </div>
    );
};

export default DeviceStatusItem;