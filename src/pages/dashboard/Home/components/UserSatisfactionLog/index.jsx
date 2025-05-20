import styles from './index.module.css';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import IconArrowRightCircle from '@/assets/images/IconArrowRightCircle.svg?react';

const data = [
    {
        user: '사용자1',
        aqi: 10,
        satisfaction: 50
    },
    {
        user: '사용자2',
        aqi: 20,
        satisfaction: 30
    },
    {
        user: '사용자3',
        aqi: 30,
        satisfaction: 70
    },
    {
        user: '사용자4',
        aqi: 40,
        satisfaction: 40
    },
    {
        user: '사용자5',
        aqi: 50,
        satisfaction: 60
    },
    {
        user: '사용자6',
        aqi: 60,
        satisfaction: 80
    },
    {
        user: '사용자7',
        aqi: 70,
        satisfaction: 90
    },
    {
        user: '사용자8',
        aqi: 80,
        satisfaction: 100
    },
    {
        user: '사용자9',
        aqi: 90,
        satisfaction: 100
    },
    {
        user: '사용자10',
        aqi: 100,
        satisfaction: 100
    }
]
const UserSatisfactionLog = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>사용자 만족도 로그</h1>
                <IconAlertCircle />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>사용자</th>
                        <th>AQI</th>
                        <th>만족도(%)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, idx) => (
                            <tr key={item.user+idx}>
                                <td>{item.user}</td>
                                <td>{item.aqi}</td>
                                <td>{item.satisfaction}</td>
                                <td><IconArrowRightCircle /></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default UserSatisfactionLog;