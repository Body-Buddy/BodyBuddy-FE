import axios from 'axios'
import tokenManager from '../utils/tokenManager'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const attachTokenToRequest = (config) => {
  const token = tokenManager.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

const handleError = (error) => {
  console.error(error)
  return Promise.reject(error)
}

const handleApiResponse = (response) => response

const handleApiError = async (error) => {
  if (!error.response) {
    console.error('Network error:', error)
    window.alert('네트워크에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
    return Promise.reject(error)
  }

  if (error.response.status === 401) {
    if (error.config.url === '/auth/login') {
      console.error('Unauthorized error:', error.response)
      window.alert('로그인에 실패했습니다. 다시 시도해주세요.')
      return Promise.reject(error)
    }
    const isRefreshSuccessful = await handleTokenRefresh()
    if (isRefreshSuccessful) {
      // 토큰 재발급 후 요청 재시도
      error.config.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`
      return instance(error.config)
    }
  }

  if (error.response.status == 400) {
    console.log(error.response)
    console.error('Bad request error:', error.response)
    window.alert('잘못된 입력입니다. 다시 확인해주세요.')
    return Promise.reject(error)
  }

  if (error.response.status >= 500) {
    console.error('Server error:', error.response)
    window.alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
    return Promise.reject(error)
  }

  return Promise.reject(error)
}

const handleTokenRefresh = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/reissue', {
      refreshToken: tokenManager.getRefreshToken()
    })

    const newAccessToken = response.headers['authorization']

    if (newAccessToken) {
      tokenManager.setAccessToken(newAccessToken.replace('Bearer ', ''))
      tokenManager.loadRefreshToken()
      return true
    }
  } catch (error) {
    console.error('토큰 재발급에 실패했습니다.', error)
  }

  return false
}

instance.interceptors.request.use(attachTokenToRequest, handleError)
instance.interceptors.response.use(handleApiResponse, handleApiError)

export default instance
