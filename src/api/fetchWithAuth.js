// src/api/fetchWithAuth.js
const fetchWithAuth = async (url, options = {}) => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = { ...(options.headers || {}) };

    if (accessToken) {
        headers['Authorization'] = accessToken.startsWith('Bearer ')
            ? accessToken
            : 'Bearer ' + accessToken;
    }

    let response = await fetch(url, { ...options, headers, credentials: 'include' });

    // accessToken이 응답 헤더에 있으면 항상 localStorage에 저장 (로그인/재발급/일반 요청 모두)
    const headerAccessToken =
        response.headers.get('access') ||
        response.headers.get('Authorization') ||
        response.headers.get('authorization');
    if (headerAccessToken) {
        // Bearer 접두사 제거
        const token = headerAccessToken.replace(/^Bearer /i, '');
        if (token.split('.').length === 3) {
            localStorage.setItem('accessToken', token);
        }
    }

    // 401 처리 (재귀 방지)
    if (response.status === 401 && !options._retry) {
        const refreshRes = await fetch('/api/reissue', {
            method: 'POST',
            credentials: 'include'
        });

        // accessToken이 응답 헤더에 있으면 저장
        const refreshHeaderToken =
            refreshRes.headers.get('access') ||
            refreshRes.headers.get('Authorization') ||
            refreshRes.headers.get('authorization');
        if (refreshHeaderToken) {
            const token = refreshHeaderToken.replace(/^Bearer /i, '');
            if (token.split('.').length === 3) {
                localStorage.setItem('accessToken', token);
            }
        }

        if (refreshRes.ok) {
            alert('토큰이 갱신되었습니다.');
            const newAccessToken =
                refreshRes.headers.get('access') ||
                refreshRes.headers.get('Authorization') ||
                refreshRes.headers.get('authorization');
            if (
                newAccessToken &&
                typeof newAccessToken === 'string' &&
                newAccessToken.split('.').length === 3
            ) {
                const token = newAccessToken.replace(/^Bearer /i, '');
                const retryHeaders = { ...(options.headers || {}) };
                retryHeaders['Authorization'] = 'Bearer ' + token;
                return fetch(url, { ...options, headers: retryHeaders, credentials: 'include', _retry: true });
            } else {
                alert('토큰 갱신에 실패: 유효한 토큰형식이 아님');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return;
            }
        } else {
            alert('토큰 갱신에 실패: api 요청 실패');
            // localStorage.removeItem('accessToken');
            // window.location.href = '/login';
            return;
        }
    }

    return response;
};

export default fetchWithAuth;