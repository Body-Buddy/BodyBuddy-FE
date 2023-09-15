<template>
  <div class="flex h-full">
    <!-- 사이드바 -->
    <div class="w-1/3 border-r h-full">
      <div>
        <h2 class="p-6 text-2xl font-bold">채팅</h2>

        <div 
          v-for="chat in chats" 
          :key="chat.roomId"
          class="p-4 border-y cursor-pointer hover:bg-gray-100"
          @click="openChat(chat.roomId)"
          @contextmenu.prevent="showExitConfirmation(chat.id)"
        >
          <h3>{{ chat.name }}</h3>
          <p>{{ chat.lastMessage }}</p>
        </div>
      </div>
    </div>

    <!-- 채팅방 -->
    <div class="w-2/3 h-full">
      <router-view v-if="$route.params.chatId"></router-view>
      <div v-else class="text-center text-xl text-gray-400 mt-20">채팅을 선택하여 시작하세요!</div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  data() {
    return {
      chats: []
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
        this.fetchChatsForSelectedGym()
      }
    }
  },
  mounted() {
    this.fetchChatsForSelectedGym()
  },
  methods: {
    async fetchChatsForSelectedGym() {
      if (!this.selectedGymId) return

      const response = await api.get(`/gym/${this.selectedGymId}/chats`)
      console.log(response.data)
      this.chats = response.data
    },
    openChat(chatId) {
      console.log(chatId)
      this.$router.push(`/chats/${chatId}`)
    },
    showExitConfirmation(chatId) {
      const isConfirmed = window.confirm('정말로 이 채팅방을 나가시겠습니까?')
      if (isConfirmed) {
        this.exitChatRoom(chatId)
      }
    },
    async exitChatRoom(chatId) {
      await api.delete(`/api/chats/${chatId}/joiners`)
      this.fetchChatsForSelectedGym() // 채팅방 목록 갱신
    }
  }
}
</script>
