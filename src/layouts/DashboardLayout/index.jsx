import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './index.module.css'
import NavigationBar from './components/NavigationBar';
import IconUser from '@/assets/images/IconUser.svg?react';
import IconBell from '@/assets/images/IconBell.svg?react';

const getPageTitle = (pathname) => {
    const pathMap = {
        '/home': 'Dashboard',
        '/analyze': 'Analyze',
        '/management': 'Management',
    };

    return pathMap[pathname] || '대시보드';
};

function DashboardLayout() {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    return (
        <div className={styles.container}>
            <NavigationBar />
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>{pageTitle}</h1>
                    <div className={styles.headerRight}>
                        <IconBell />
                        <IconUser />
                    </div>
                </header>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout 