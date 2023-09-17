<template>
  <div class="max-w-3xl mx-auto mt-10">
    <div class="p-4">
      <h2 class="text-2xl font-bold">친구 목록</h2>
      <p class="mt-4 text-gray-600 text-md">
        {{ nickname ? nickname : '사용자' }}님의 관심 태그를 기반으로 매칭 점수가 높은 친구들을
        우선적으로 보여드리고 있어요.
      </p>
    </div>
    <div v-for="friend in friends" :key="friend.id" class="friend-entry">
      <FriendProfile :friend="friend" @startChat="startChat" />
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'
import FriendProfile from './FriendProfile.vue'

export default {
  components: {
    FriendProfile
  },
  data() {
    return {
      friends: [],
      nickname: this.$store.getters.getUser.nickname
    }
  },
  computed: {
    selectedGymId() {
      return this.$store.getters.getSelectedGymId
    }
  },
  watch: {
    selectedGymId(newGymId, oldGymId) {
      if (newGymId !== oldGymId) {
        this.fetchFriendsForSelectedGym()
      }
    }
  },
  mounted() {
    this.fetchFriendsForSelectedGym()
  },
  methods: {
    async fetchFriendsForSelectedGym() {
      if (!this.selectedGymId) return
      const response = await api.get(`/gyms/${this.selectedGymId}/matches`)
      this.friends = response.data
    },
    async startChat(friendId) {
      const response = await api.post(`/gyms/${this.selectedGymId}/direct-chats/users/${friendId}`)
      this.$router.push(`/chats/${response.data}`)
    }
  }
}
</script>

<style>
.friend-entry {
  border-bottom: 2px solid #e2e8f0;
  padding: 1.5rem 1rem;
  margin-top: 1rem;
  background-color: #f7fafc;
  transition: background-color 0.3s ease;
  border-radius: 15px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.friend-entry:hover {
  background-color: #edf2f7;
}
</style>
