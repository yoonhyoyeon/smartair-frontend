import styles from './index.module.css';
import Card from './Card';

const MeasurementCards = () => {
    const dummyData = [
        { title: 'PM2.5', value: 12.3, high: 30.0, low: 8.2, color: 'yellow' },
        { title: 'PM2.5', value: 35.7, high: 46.0, low: 15.4, color: 'green' },
        { title: 'PM2.5', value: 48.1, high: 52.0, low: 20.0, color: 'red' },
        { title: 'PM2.5', value: 22.5, high: 40.0, low: 10.0, color: 'yellow' },
        { title: 'PM2.5', value: 18.9, high: 28.0, low: 9.5, color: 'yellow' },
        { title: 'PM2.5', value: 29.4, high: 38.0, low: 12.1, color: 'green' },
        { title: 'PM2.5', value: 41.2, high: 50.0, low: 18.7, color: 'red' },
        { title: 'PM2.5', value: 16.8, high: 25.0, low: 7.9, color: 'green' },
        { title: 'PM2.5', value: 27.6, high: 36.0, low: 11.3, color: 'green' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.main_area}>
                <Card title="PM2.5" value={24.8} high={46.0} low={12.0} color="yellow" />
                <Card title="CO2" value={619} high={1659} low={487} color="green"/>
            </div>
            <div className={styles.sub_area}>
                {dummyData.map((item, idx) => (
                    <Card
                        key={item.title+idx}
                        title={item.title}
                        value={item.value}
                        high={item.high}
                        low={item.low}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
};

export default MeasurementCards;