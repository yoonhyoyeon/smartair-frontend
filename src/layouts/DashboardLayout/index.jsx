import React, { useEffect } from 'react'
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

    // fetchWithAuth 함수 등록
    useEffect(() => {
        window.fetchWithAuth = async function(url, options = {}) {
            // accessToken을 localStorage에서 읽음
            const accessToken = localStorage.getItem('accessToken');
            const headers = options.headers ? { ...options.headers } : {};

            if (accessToken) {
                headers['Authorization'] = 'Bearer ' + accessToken;
            }

            // fetch 요청
            let response = await fetch(url, { ...options, headers, credentials: 'include' });

            // accessToken 만료(401) 시 리프레시 시도
            if (response.status === 401) {
                // 리프레시 토큰 요청
                const refreshRes = await fetch('/reissue', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    // 새 accessToken이 있으면 저장
                    if (data.accessToken) {
                        localStorage.setItem('accessToken', data.accessToken);
                        // 원래 요청 재시도
                        headers['Authorization'] = 'Bearer ' + data.accessToken;
                        response = await fetch(url, { ...options, headers, credentials: 'include' });
                    } else {
                        // 재발급 실패: 로그아웃
                        localStorage.removeItem('accessToken');
                        window.location.href = '/login';
                        return;
                    }
                } else {
                    // 재발급 실패: 로그아웃
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                    return;
                }
            }

            return response;
        };
    }, []);

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