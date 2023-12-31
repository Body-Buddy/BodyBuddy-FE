<template>
  <div class="flex justify-center items-center h-screen">
    <div class="p-8 w-full max-w-md mb-20">
      <h1 class="font-bold text-2xl mb-6 text-center">Sign Up</h1>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">이메일</label>
        <div class="flex">
          <input
            class="shadow appearance-none border rounded w-3/4 py-2 px-3 mr-2"
            type="email"
            v-model="email"
            id="email"
            placeholder="이메일 주소"
          />
          <button
            :disabled="emailCodeSent"
            :class="{ 'bg-gray-400': emailCodeSent, 'bg-blue-600': !emailCodeSent }"
            class="text-white font-bold py-2 px-4 rounded w-1/4"
            @click="sendEmailCode"
          >
            전송
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2 w-full" for="emailCode"
          >인증코드</label
        >
        <div class="flex">
          <input
            :class="{ 'border-red-500': showEmailVerificationError }"
            class="shadow appearance-none border rounded w-3/4 py-2 px-3 mr-2"
            type="text"
            v-model="emailCode"
            id="emailCode"
            placeholder="인증코드"
          />
          <button
            :disabled="isEmailVerified"
            :class="{ 'bg-gray-400': isEmailVerified, 'bg-blue-600': !isEmailVerified }"
            class="text-white font-bold py-2 px-4 rounded w-1/4"
            @click="verifyEmailCode"
          >
            확인
          </button>
        </div>
        <span v-if="showEmailVerificationError" class="text-red-500 text-xs mt-2"
          >이메일 인증을 완료해주세요.</span
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">비밀번호</label>
        <input
          :class="{ 'border-red-500': !isValidPassword }"
          class="shadow appearance-none border rounded w-full py-2 px-3"
          type="password"
          v-model="password"
          id="password"
          placeholder="비밀번호"
        />
        <span v-if="!isValidPassword" class="text-red-500 text-xs mt-2"
          >비밀번호는 8~15자이며, 대소문자, 숫자, 특수문자를 각 1개 이상 포함해야 합니다.</span
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">성별</label>
        <input class="mr-2 leading-tight" type="radio" value="M" v-model="gender" id="male" /><label
          class="text-gray-700 text-sm mr-4"
          for="male"
          >남성</label
        >
        <input
          class="mr-2 leading-tight"
          type="radio"
          value="F"
          v-model="gender"
          id="female"
        /><label class="text-gray-700 text-sm" for="female">여성</label>
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="birthDate">생년월일</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3"
          type="date"
          v-model="birthDate"
          id="birthDate"
        />
      </div>

      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        @click="handleSignup"
      >
        계정 생성
      </button>

      <div class="login-redirect mt-6 text-center">
        이미 회원이신가요?
        <router-link class="text-blue-600 underline" to="/login">로그인</router-link>
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
      emailCode: '',
      password: '',
      gender: '',
      birthDate: '',
      emailCodeSent: false,
      isEmailVerified: false,
      isValidPassword: true,
      showEmailVerificationError: false
    }
  },
  watch: {
    password(newValue) {
      this.checkPasswordPattern(newValue)
    }
  },

  methods: {
    checkPasswordPattern(password) {
      const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,15}$/
      this.isValidPassword = pattern.test(password)
    },

    async sendEmailCode() {
      this.emailCodeSent = true

      const response = await api.post('/email-verification/request', {
        email: this.email
      })

      if (response.status === 200) {
        window.alert('이메일이 전송되었습니다!')
      } else {
        this.emailCodeSent = false
      }
    },
    async verifyEmailCode() {
      const response = await api.post('/email-verification/confirm', {
        email: this.email,
        code: this.emailCode
      })

      if (response.status === 200) {
        window.alert('이메일 인증이 완료되었습니다!')
        this.isEmailVerified = true
      }
    },
    async handleSignup() {
      this.showEmailVerificationError = !this.isEmailVerified

      if (
        this.email === '' || this.password === '' ||
        this.gender === '' || this.birthDate === ''
      ) {
        window.alert('모든 항목을 입력해주세요.')
        return
      }

      const response = await api.post('/auth/signup', {
        email: this.email,
        password: this.password,
        gender: this.gender,
        birthDate: this.birthDate
      })

      if (response.status === 200) {
        this.$router.push('/login')
      }
    }
  }
}
</script>
