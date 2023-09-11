<template>
  <div class="max-w-xl mx-auto mt-10">
    <h2 class="p-4 text-2xl font-bold">친구 목록</h2>
    <div v-for="friend in friends" :key="friend.id" class="friend-entry">
      <FriendProfile :friend="friend" @startChat="startChat"/>
    </div>
  </div>
</template>

<script>
import api from '@/axios.js'
import tokenManager from '../tokenManager'
import { useEventBus } from '../eventBus'
import FriendProfile from '@/components/FriendProfile.vue'

export default {
  components: {
    FriendProfile
  },
  data() {
    return {
      user: null,
      selectedGymId: null,
      friends: []
    }
  },
  async mounted() {
    this.initializeUser()
    this.initializeEventListeners()
  },
  beforeUnmount() {
    this.removeEventListeners()
  },
  methods: {
    async initializeUser() {
      tokenManager.loadTokenFromCookie()
      await this.getUserInfo()
    },
    initializeEventListeners() {
      useEventBus().on('gymChanged', this.onGymChanged)
    },
    removeEventListeners() {
      useEventBus().off('gymChanged', this.onGymChanged)
    },
    async getUserInfo() {
      const response = await api.get('/auth/user')
      this.user = response.data
    },
    onGymChanged(newGymId) {
      this.selectedGymId = newGymId
      this.fetchFriendsForSelectedGym()
    },
    async fetchFriendsForSelectedGym() {
      if (!this.selectedGymId) return
      const response = await api.get(`/gyms/${this.selectedGymId}/matches`)
      this.friends = response.data
    },
    startChat(friendId) {
      // 채팅방 id 를 받아서 채팅방으로 이동
      //this.$router.push(`/chats/`)
    }
  }
}
</script>

<style>
.friend-entry {
  border-bottom: 1px solid;
  padding-top: 1rem;
  margin-top: 1rem;
}
</style>
