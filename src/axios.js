import axios from 'axios'
import router from '@/router'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Interceptor to attach token to requests
const attachTokenToRequest = (config) => {
  const token = localStorage.getItem('jwtToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}

const handleError = (error) => {
  console.error(error)
  return Promise.reject(error)
}

// Interceptor to handle API responses and errors
const handleApiResponse = (response) => response
const handleApiError = async (error) => {
  // Network error
  if (!error.response) {
    console.error('Network error:', error)
    window.alert('네트워크에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
    return Promise.reject(error)
  }

  // Unauthenticated error
  if (error.response.status === 401) {
    if (error.config.url !== '/users/login') {
      const isRefreshSuccessful = await handleTokenRefresh(error)
      if (!isRefreshSuccessful) return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  }

  // Server error
  if (error.response.status >= 500) {
    console.error('Server error:', error.response.status)
    window.alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
    return Promise.reject(error)
  }
}

// Handle token refresh
const handleTokenRefresh = async (error) => {
  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) return false

  try {
    const newTokenResponse = await axios.post('/token/refresh', { refreshToken })
    localStorage.setItem('jwtToken', newTokenResponse.data.token)
    error.config.headers['Authorization'] = 'Bearer ' + newTokenResponse.data.token
    return axios.request(error.config)
  } catch (refreshError) {
    router.push('/login')
    console.error('Token refresh failed:', refreshError)
    return false
  }
}

// Applying interceptors
instance.interceptors.request.use(attachTokenToRequest, handleError)
instance.interceptors.response.use(handleApiResponse, handleApiError)

export default instance
