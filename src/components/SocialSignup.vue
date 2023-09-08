<template>
  <div class="max-w-xl mx-auto mt-10">
    <div class="p-8 w-full max-w-md mb-20">
      <p v-if="user" class="font-bold text-2xl mb-2">{{ user.nickname ? user.nickname : '사용자'}}님, 안녕하세요!</p>
      <p class="text-gray-600">필수 정보를 입력하여 가입을 완료해주세요.</p>
      <div class="my-10">
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

      <div class="mb-10">
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
        @click="handleSocialSignup"
      >
        가입 완료하기
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/axios.js'
import tokenManager from '../tokenManager'

export default {
  data() {
    return {
      user: null,
      gender: '',
      birthDate: ''
    }
  },
  async mounted() {
    tokenManager.loadTokenFromCookie()
    await this.getUser()
  },
  methods: {
    async getUser() {
      const response = await api.get('/auth/user')
      this.user = response.data
    },
    async handleSocialSignup() {
      try {
        const response = await api.post('/auth/social-signup', {
          gender: this.gender,
          birthDate: this.birthDate
        })
        console.log(response)

        if (response.status === 200) {
          this.$router.push('/gyms/setup')
        } else {
          alert('필수 정보를 모두 입력해주세요.')
        }
      } catch (error) {
        console.error('Error during signup:', error)
        alert('회원가입 중 문제가 발생했습니다. 다시 시도해주세요.')
      }
    }
  }
}
</script>
