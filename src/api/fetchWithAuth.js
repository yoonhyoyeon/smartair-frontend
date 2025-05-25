// src/api/fetchWithAuth.js
const fetchWithAuth = async (url, options = {}) => {
    const accessToken = localStorage.getItem('accessToken');
    // 항상 새 headers 객체 생성
    const headers = { ...(options.headers || {}) };

    if (accessToken) {
        headers['Authorization'] = 'Bearer ' + accessToken;
    }

    let response = await fetch(url, { ...options, headers, credentials: 'include' });

    // 401 처리 (재귀 방지)
    if (response.status === 401 && !options._retry) {
        // 리프레시 토큰 요청
        const refreshRes = await fetch('/api/reissue', {
            method: 'POST',
            credentials: 'include'
        });

        if (refreshRes.ok) {
            // accessToken은 헤더에서 추출
            const newAccessToken = refreshRes.headers.get('Authorization')?.replace('Bearer ', '');
            if (
                newAccessToken &&
                typeof newAccessToken === 'string' &&
                newAccessToken.split('.').length === 3
            ) {
                localStorage.setItem('accessToken', newAccessToken);
                // 새 accessToken으로 재요청 (headers 새로 생성)
                const retryHeaders = { ...(options.headers || {}) };
                retryHeaders['Authorization'] = 'Bearer ' + newAccessToken;
                return fetch(url, { ...options, headers: retryHeaders, credentials: 'include', _retry: true });
            } else {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return;
            }
        } else {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            return;
        }
    }

    return response;
};

export default fetchWithAuth;