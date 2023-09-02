import axios from 'axios'
import router from '@/router'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api'
})

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 401 Unauthorized 응답이 오면 토큰이 유효하지 않다고 가정
    if (error.response && error.response.status === 401) {
      // 로그인 페이지로 이동
      router.push({ path: '/login' })
    }
    return Promise.reject(error)
  }
)

export default instance
