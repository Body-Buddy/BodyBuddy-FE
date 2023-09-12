<template>
  <div class="max-w-xl mx-auto mt-10">
    <h2 class="p-4 text-2xl font-bold">친구 목록</h2>
    <div v-for="friend in friends" :key="friend.id" class="friend-entry">
      <FriendProfile :friend="friend" @startChat="startChat"/>
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
      friends: []
    }
  },
  computed: {
    selectedGymId() {
      return this.$store.getters.getSelectedGymId
    },
    userId() {
      return this.$store.state.user.id
    }
  },
  watch: {
    selectedGymId(newGymId, oldGymId) {
      if (newGymId !== oldGymId) {
        this.fetchFriendsForSelectedGym()
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('updateUserInfo')
    this.fetchFriendsForSelectedGym()
  },
  methods: {
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
