import styles from '../index.module.css';
import { NavLink, Link } from 'react-router-dom';
import IconHome from '@/assets/images/IconHome.svg?react';
import IconAnalyze from '@/assets/images/IconAnalyze.svg?react';
import IconMore from '@/assets/images/IconMore.svg?react';
import logo from '@/assets/images/logo_simple.svg';

const NavigationBar = () => {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };
    return (
        <nav className={styles.navigationBar}>
            <Link to="/home">
                <img className={styles.logo} src={logo} alt="logo" />
            </Link>
            <ul>
                <NavLink 
                    to="/home"
                    className={({ isActive }) => isActive ? styles.active : ''}
                >
                    <li>
                    
                        <IconHome />
                        <span>홈</span>
                    </li>
                </NavLink>
                <NavLink 
                    to="/analyze"
                    className={({ isActive }) => isActive ? styles.active : ''}
                >
                    <li>
                        <IconAnalyze />
                        <span>분석</span>
                    </li>
                </NavLink>

                <NavLink
                    to="/management"
                    className={({ isActive }) => isActive ? styles.active : ''}
                >
                    <li>
                        <IconMore />
                        <span>관리</span>
                    </li>
                </NavLink>
            </ul>
            <span onClick={handleLogout} className={styles.setting}>로그아웃</span>
        </nav>
    )
}

export default NavigationBar;