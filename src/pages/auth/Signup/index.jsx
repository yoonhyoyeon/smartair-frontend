import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'

function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordCheck = e.target.passwordCheck.value;
    const nickname = e.target.nickname.value;
    const username = e.target.username.value;
    const role = 'USER';
    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await fetch('api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({ email, password, nickname, username, role }),
      });
      const data = await response.json();
      alert('회원가입 성공\n로그인 페이지로 이동합니다.');
      console.log(data);
      navigate('/login');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('회원가입 실패');
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
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
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            className={styles.input}
            placeholder="닉네임을 입력하세요"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="username">이름</label>
          <input
            type="text"
            id="username"
            className={styles.input}
            placeholder="이름을 입력하세요"
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
        <div className={styles.inputGroup}>
          <label htmlFor="passwordCheck">비밀번호 확인</label>
          <input
            type="password"
            id="passwordCheck"
            className={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
        <div className={styles.bottomText}>
          이미 계정이 있으신가요?{' '}
          <span className={styles.link} onClick={() => navigate('/login')}>로그인</span>
        </div>
      </form>
    </div>
  )
}

export default Login 