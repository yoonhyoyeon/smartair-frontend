import styles from './index.module.css';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import IconArrowRightCircle from '@/assets/images/IconArrowRightCircle.svg?react';

const data = [
    {
        roomName: '방1',
        aqi: 10,
        satisfaction: 50
    },
    {
        roomName: '방2',
        aqi: 20,
        satisfaction: 30
    },
    {
        roomName: '방3',
        aqi: 30,
        satisfaction: 70
    },
    {
        roomName: '방4',
        aqi: 40,
        satisfaction: 40
    },
    {
        roomName: '방5',
        aqi: 50,
        satisfaction: 60
    },
    {
        roomName: '방6',
        aqi: 60,
        satisfaction: 80
    },
    {
        roomName: '방7',
        aqi: 70,
        satisfaction: 90
    },
    {
        roomName: '방8',
        aqi: 80,
        satisfaction: 100
    },
    {
        roomName: '방9',
        aqi: 90,
        satisfaction: 100
    },
    {
        roomName: '방10',
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
                        <th>방 이름</th>
                        <th>AQI</th>
                        <th>만족도(%)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, idx) => (
                            <tr key={item.roomName}>
                                <td>{item.roomName}</td>
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