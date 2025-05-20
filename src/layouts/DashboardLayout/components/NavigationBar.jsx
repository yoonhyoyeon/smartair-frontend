import styles from '../index.module.css';
import { NavLink, Link } from 'react-router-dom';
import IconHome from '@/assets/images/IconHome.svg?react';
import IconAnalyze from '@/assets/images/IconAnalyze.svg?react';
import IconMore from '@/assets/images/IconMore.svg?react';
import logo from '@/assets/images/logo_simple.svg';

const NavigationBar = () => {
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
                        <span>통계</span>
                    </li>
                </NavLink>

                <NavLink
                    to="/more"
                    className={({ isActive }) => isActive ? styles.active : ''}
                >
                    <li>
                        <IconMore />
                        <span>더보기</span>
                    </li>
                </NavLink>
            </ul>
            <Link to="/setting" className={styles.setting}>계정 설정</Link>
        </nav>
    )
}

export default NavigationBar;