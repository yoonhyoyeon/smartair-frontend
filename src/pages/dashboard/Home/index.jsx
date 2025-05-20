import React from 'react'
import styles from './index.module.css'
import SensorMeasurement from './components/SensorMeasurement'
import UserSatisfactionLog from './components/UserSatisfactionLog'
import DeviceStatus from './components/DeviceStatus'

function DashboardHome() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <SensorMeasurement />
        <DeviceStatus />
      </div>
      <div className={styles.right}>
        <UserSatisfactionLog />
      </div>
    </div>
  )
}

export default DashboardHome 