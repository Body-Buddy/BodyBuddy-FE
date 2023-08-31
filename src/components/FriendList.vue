<template>
  <div class="bg-gray-100 min-h-screen pt-8 pb-20">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <div class="relative mb-6">
        <select
          v-model="selectedGymId"
          @change="fetchFriendsForSelectedGym"
          class="w-full appearance-none p-2 border rounded focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold mb-2">친구 목록</h1>
        <p class="text-sm text-gray-500 mb-2">같은 헬스장에서 운동하는 친구들을 만나보세요!</p>
    </div>
    <div v-for="friend in friends" :key="friend.id" class="border-t pt-4 mt-4">
        <div class="flex items-center mb-4">
          <img
            :src="friend.imageUrl"
            alt="Profile Image"
            class="w-12 h-12 rounded-full flex-none mr-4"
          />
          <div class="flex-grow text-lg font-semibold">{{ friend.nickname }}</div>
          <!-- 버튼을 우측 하단으로 옮기기 위한 변경 -->
          <button
            @click="startChat(friend.userId)"
            class="ml-auto bg-blue-500 text-white rounded-full px-3 py-1 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
          <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="text-sm text-gray-500 mb-4">{{ friend.introduction }}</div>
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
      } catch (error) {
        console.error('친구 목록을 가져오는 중 오류 발생:', error)
      }
    },
    startChat(friendId) {
      this.$router.push(`/chats/private/${friendId}`)
    }
  },
  mounted() {
    this.fetchUserGyms()
  }
}
</script>
