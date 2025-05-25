import styles from './index.module.css';
import Card from './Card';

const mainLabelMap = [
  { key: 'temperature', label: '온도(℃)' },
  { key: 'humidity', label: '습도(%)' },
];
const subLabelMap = [
  { key: 'pressure', label: '기압(hPa)' },
  { key: 'eco2', label: 'eCO₂(ppm)' },
  { key: 'tvoc', label: 'TVOC(ppb)' },
  { key: 'rawh2', label: 'Raw H₂' },
  { key: 'rawethanol', label: 'Raw Ethanol' },
  { key: 'pt1_pm10_standard', label: 'PT1 PM10' },
  { key: 'pt1_pm25_standard', label: 'PT1 PM2.5' },
  { key: 'pt2_pm10_standard', label: 'PT2 PM10' },
  { key: 'pt2_pm25_standard', label: 'PT2 PM2.5' },
];

// 수치에 따라 색상 결정
function getColor(key, value) {
  if (value === undefined || value === null || value === '-') return 'gray';
  switch (key) {
    case 'temperature':
      if (value < 18) return 'blue';
      if (value <= 27) return 'green';
      if (value <= 30) return 'yellow';
      return 'red';
    case 'humidity':
      if (value < 30) return 'yellow';
      if (value <= 60) return 'green';
      if (value <= 80) return 'yellow';
      return 'red';
    case 'pressure':
      if (value < 980) return 'yellow';
      if (value <= 1030) return 'green';
      return 'red';
    case 'eco2':
      if (value < 800) return 'green';
      if (value < 1200) return 'yellow';
      return 'red';
    case 'tvoc':
      if (value < 300) return 'green';
      if (value < 600) return 'yellow';
      return 'red';
    case 'rawh2':
    case 'rawethanol':
      if (value < 50) return 'green';
      if (value < 100) return 'yellow';
      return 'red';
    case 'pt1_pm10_standard':
    case 'pt2_pm10_standard':
      if (value < 30) return 'green';
      if (value < 80) return 'yellow';
      return 'red';
    case 'pt1_pm25_standard':
    case 'pt2_pm25_standard':
      if (value < 15) return 'green';
      if (value < 35) return 'yellow';
      return 'red';
    default:
      return 'gray';
  }
}

const MeasurementCards = ({ measurement }) => {
  if (!measurement) {
    return <div>데이터 없음</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_area}>
        {mainLabelMap.map(({ key, label }) => (
          <Card
            key={key}
            title={label}
            value={measurement[key] !== undefined ? measurement[key] : '-'}
            color={getColor(key, measurement[key])}
          />
        ))}
      </div>
      <div className={styles.sub_area}>
        {subLabelMap.map(({ key, label }) => (
          <Card
            key={key}
            title={label}
            value={measurement[key] !== undefined ? measurement[key] : '-'}
            color={getColor(key, measurement[key])}
          />
        ))}
      </div>
    </div>
  );
};

export default MeasurementCards;