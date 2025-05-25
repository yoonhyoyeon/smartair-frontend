import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './index.module.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    console.log('mount: ' + localStorage.getItem('accessToken'))
    if (localStorage.getItem('accessToken')) {
      navigate('/home', { replace: true })
    }
    return () => {
      console.log('unmount: ' + localStorage.getItem('accessToken'));
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const data = await response.json();

      // accessToken, refreshToken 모두 저장
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate('/home');
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호를 확인해주세요');
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>로그인</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          로그인
        </button>
        <div className={styles.bottomText}>
          계정이 없으신가요?{' '}
          <span className={styles.link} onClick={() => navigate('/signup')}>회원가입</span>
        </div>
      </form>
    </div>
  )
}

export default Login 