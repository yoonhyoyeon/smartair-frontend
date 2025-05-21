import styles from './index.module.css';
import MeasurementCards from '@/components/MeasurementCards';
import MeasurementGraph from '@/components/MeasurementGraph';
import MeasurementScatter from './components/MeasurementScatter';
import MeasurementAreaChart from './components/MeasurementAreaChart';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';

const DashboardAnalyze = () => {
    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.itemWrapper}>
                    <div className={styles.header}>
                        <h1>측정값</h1>
                        <IconAlertCircle />
                    </div>
                    <MeasurementCards />
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.header}>
                        <h1>변화</h1>
                        <IconAlertCircle />
                    </div>
                    <MeasurementGraph />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.itemWrapper}>
                    <div className={styles.header}>
                        <h1>상관관계</h1>
                        <IconAlertCircle />
                    </div>
                    <MeasurementScatter />
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.header}>
                        <h1>비율</h1>
                        <IconAlertCircle />
                    </div>
                    <MeasurementAreaChart />
                </div>
            </div>
        </div>
    )
}
export default DashboardAnalyze;