import axios from 'axios'
import store from '@/store'
import router from '@/router/router'
import Cookies from 'js-cookie'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const attachTokenToRequest = (config) => {
  const token = store.getters.getAccessToken
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
      error.config.headers.Authorization = `Bearer ${store.getters.getAccessToken}`
      return instance(error.config)
    } else {
      window.alert('세션이 만료되었습니다. 다시 로그인해주세요.')
      store.commit('logout')
      router.push({ name: 'Login' })
    }
  }

  if (error.response.status == 400) {
    console.log(error.response)
    console.error('Bad request error:', error.response)
    window.alert(error.response.data.errorMessage)
    return Promise.reject(error)
  }

  if (error.response.status >= 500) {
    console.error('Server error:', error.response)
    window.alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
    return Promise.reject(error)
  }

  return Promise.reject(error)
}

export const handleTokenRefresh = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/reissue', {
      refreshToken: Cookies.get('refreshToken')
    })

    const newAccessToken = response.headers['authorization']

    if (newAccessToken) {
      store.commit('setAccessToken', newAccessToken.replace('Bearer ', ''))
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
