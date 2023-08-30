<template>
  <div class="signup-container bg-white shadow-md rounded-lg p-6 mx-auto w-96">
    <h1 class="text-2xl font-bold mb-4">로그인</h1>

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
        class="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none"
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
      ><router-link class="text-blue-500 hover:underline" to="/signup">회원가입</router-link>
    </div>
  </div>
</template>

<script>
import api from '@/axios.js'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await api.post('/users/login', {
          email: this.email,
          password: this.password
        })

        if (response.status === 200) {
          if (response.isNewUser === true) {
            this.$router.push('/profile/setup')
          } else {
            this.$router.push('/friends')
          }
        } else {
          alert('로그인 중 문제가 발생했습니다. 다시 시도해주세요.')
        }
      } catch (error) {
        console.error('Error during signup:', error)
        alert('로그인 중 문제가 발생했습니다. 다시 시도해주세요.')
      }
    },
    handleNaverLogin() {},
    handleKakaoLogin() {},
    handleGoogleLogin() {}
  }
}
</script>
