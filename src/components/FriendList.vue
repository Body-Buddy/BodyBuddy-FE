<template>
  <div class="max-w-xl mx-auto mt-10">
    <div class="flex items-center">
      <h2 class="text-2xl font-bold">친구 목록</h2>

      <!-- 헬스장 선택 드롭다운 -->
      <div class="relative ml-6">
        <select
          v-model="selectedGymId"
          @change="fetchFriendsForSelectedGym"
          class="w-48 appearance-none p-2 border rounded"
        >
          <option v-for="gym in gyms" :key="gym.id" :value="gym.id">{{ gym.name }}</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 9.293L10 14.586l4.707-4.293-.707-.707L10 13.172 6 9.293l-.707.707z" />
          </svg>
        </div>
      </div>
    </div>

    <div v-for="friend in friends" :key="friend.id" class="border-b pt-4 mt-4">
      <div class="flex items-center mb-4">
        <img
          :src="friend.imageUrl"
          alt="Profile Image"
          class="w-24 h-24 rounded-full flex-none mr-4"
        />

        <div class="flex-col">
          <div class="flex-grow text-lg font-semibold mb-2">{{ friend.nickname }}</div>
          <div class="text-gray-500 mb-4">{{ friend.introduction }}</div>
        </div>
        <button
          @click="startChat(friend.userId)"
          class="ml-auto bg-blue-500 text-white rounded-full h-8 w-10 flex items-center justify-center transition-transform transform hover:scale-110 hover:bg-blue-600 active:scale-100 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 shadow-lg"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/axios.js'

export default {
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      friends: [],
      gyms: [],
      selectedGymId: null
    }
  },
  mounted() {
    this.fetchUserGyms()
  },
  methods: {
    async fetchUserGyms() {
      try {
        const response = await api.get(`/users/${this.userId}/gyms`)
        this.gyms = response.data
        if (this.gyms.length > 0) {
          this.selectedGymId = this.gyms[0].id // 초기값으로 첫 번째 헬스장을 설정
          this.fetchFriendsForSelectedGym()
        }
      } catch (error) {
        console.error('헬스장 목록을 가져오는 중 오류 발생:', error)
      }
    },
    async fetchFriendsForSelectedGym() {
      if (!this.selectedGymId) return
      try {
        const response = await api.get(`/gyms/${this.selectedGymId}/matches`)
        this.friends = response.data
        console.log(response.data)
      } catch (error) {
        console.error('친구 목록을 가져오는 중 오류 발생:', error)
      }
    },
    startChat(friendId) {
      this.$router.push(`/chats/private/${friendId}`)
    }
  }
}
</script>
