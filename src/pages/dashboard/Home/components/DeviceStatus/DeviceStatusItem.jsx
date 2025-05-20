import styles from './index.module.css';
import IconPower from '@/assets/images/IconPower.svg?react';
import cx from 'classnames';

const DeviceStatusItem = ({isActive=false}) => {
    return (
        <div className={cx(styles.DeviceStatusItem, isActive && styles.active)}>
            <div className={styles.power}>
                <IconPower className={styles.powerIcon} />
            </div>
            <span className={styles.name}>기기 이름</span>
            <span className={styles.room}>김도완의 방</span>
        </div>
    );
};

export default DeviceStatusItem;