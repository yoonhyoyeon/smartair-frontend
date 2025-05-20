import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './index.module.css'
import logo_gradient from '@/assets/images/logo_gradient.svg'

function AuthLayout() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.logoWrapper}>
          <img src={logo_gradient} alt="logo" />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.fadeWrap} key={location.pathname}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout 