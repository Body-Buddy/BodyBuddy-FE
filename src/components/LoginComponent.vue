<template>
  <div class="flex justify-center items-center h-screen">
    <div class="p-8 w-full max-w-md mb-20">
      <h1 class="font-bold text-2xl mb-6 text-center">Welcome! </h1>

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
        ><router-link class="text-blue-500 hover:underline" to="/signup">가입하기</router-link>
      </div>
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
          window.alert('성공적으로 로그인되었습니다!')

          const userId = response.data.userId
          const profileExists = response.data.profileExists
          const token = response.headers.get('Authorization')

          if (token) {
            localStorage.setItem('jwtToken', token.replace('Bearer ', ''))
          }

          if (profileExists === true) {
            this.$router.push('/friends')
          } else {
            this.$router.push({
              name: 'GymSearch',
              params: { userId: userId }
            })
          }
        } else {
          alert('회원 정보가 일치하지 않습니다.')
        }
      } catch (error) {
        console.error('Error during login:', error)
        alert('로그인 중 문제가 발생했습니다. 다시 시도해주세요.')
      }
    },
    handleNaverLogin() {},
    handleKakaoLogin() {},
    handleGoogleLogin() {}
  }
}
</script>
