import styles from './index.module.css';
import CountUp from 'react-countup';

const Card = ({ title, value, high, low, color }) => {
    return (
        <div className={styles.card}>
            <h1>{title}</h1>
            <span className={styles.value} style={{ color: `var(--color-${color}-0)` }}>
                <CountUp end={value} duration={1} />
            </span>
            <div className={styles.sub_value}>
                <span>H: {high}</span>
                <span>L: {low}</span>
            </div>
        </div>
    );
};

export default Card;