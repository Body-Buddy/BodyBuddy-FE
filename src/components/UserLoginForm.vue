<template>
  <div class="flex justify-center items-center h-screen">
    <div class="p-8 w-full max-w-md mb-20">
      <h1 class="font-bold text-2xl mb-6 text-center">Welcome!</h1>

      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="email"> 이메일 </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          v-model="email"
          id="email"
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-bold mb-2" for="password"> 비밀번호 </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          v-model="password"
          id="password"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <div class="mb-6">
        <button
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none"
          @click="handleLogin"
        >
          로그인
        </button>
      </div>

      <div class="social-login mb-6 space-y-4">
        <button
          class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none"
          @click="handleNaverLogin"
        >
          네이버로 시작하기
        </button>
        <button
          class="w-full bg-yellow-400 text-white font-bold py-2 px-4 rounded focus:outline-none"
          @click="handleKakaoLogin"
        >
          카카오로 시작하기
        </button>
        <button
          class="w-full bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none"
          @click="handleGoogleLogin"
        >
          구글로 시작하기
        </button>
      </div>

      <div class="signup-redirect text-center">
        <span class="text-sm">계정이 없으신가요? </span
        ><router-link class="text-blue-500 hover:underline" to="/signup">가입하기</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      if (this.email === '' || this.password === '') {
        window.alert('이메일과 비밀번호를 입력해주세요!')
        return
      }

      const response = await api.post('/auth/login', {
        email: this.email,
        password: this.password
      })
      window.alert('성공적으로 로그인되었습니다!')

      const user = response.data
      const accessToken = response.headers.get('Authorization')

      if (accessToken) {
        this.$store.commit('setUser', user)
        this.$store.commit('setAccessToken', accessToken.replace('Bearer ', ''))
      }

      if (!user.hasRegisteredGym) {
        this.$router.push('/gyms/setup')
      } else if (!user.hasSetProfile) {
        this.$router.push('/profile/setup')
      } else if (!user.hasSetMatchingCriteria) {
        this.$router.push('/matching/setup')
      } else {
        this.$router.push('/friends')
      }
    },
    handleNaverLogin() {
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/oauth2/authorization/naver`
    },
    handleKakaoLogin() {
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/oauth2/authorization/kakao`
    },
    handleGoogleLogin() {
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/oauth2/authorization/google`
    }
  }
}
</script>
