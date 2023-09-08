import axios from 'axios'
import tokenManager from './tokenManager'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const attachTokenToRequest = (config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleError = (error) => {
  console.error(error);
  return Promise.reject(error);
};

const handleApiResponse = (response) => response;

const handleApiError = async (error) => {
  if (!error.response) {
    console.error('Network error:', error);
    window.alert('네트워크에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    return Promise.reject(error);
  }

  if (error.response.status === 401 && error.config.url !== '/auth/login') {
    const isRefreshSuccessful = await handleTokenRefresh();
    if (isRefreshSuccessful) {
      // 토큰 재발급 후 요청 재시도
      error.config.headers.Authorization = `Bearer ${tokenManager.getToken()}`;
      return instance(error.config);
    }
  }

  if (error.response.status >= 500) {
    console.error('Server error:', error.response.status);
    window.alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    return Promise.reject(error);
  }

  return Promise.reject(error);
};

const handleTokenRefresh = async () => {
  const refreshToken = tokenManager.getRefreshToken();

  if (!refreshToken) return false;

  try {
    const response = await axios.post('/auth/reissue', { refreshToken });
    // 응답 헤더에서 액세스 토큰 추출하고 저장
    const newAccessToken = response.headers['authorization'];
    if (newAccessToken) {
      tokenManager.setAccessToken(newAccessToken.replace('Bearer ', ''));
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  return false;
};

instance.interceptors.request.use(attachTokenToRequest, handleError);
instance.interceptors.response.use(handleApiResponse, handleApiError);

export default instance;
