<template>
  <div class="flex h-full">
    <!-- 사이드바 -->
    <div class="w-1/3 border-r h-full">
      <div class="p-4">
        <h2 class="p-4 text-2xl font-bold">채팅</h2>

        <chat-item
          v-for="chat in chats"
          :key="chat.id"
          :chat="chat"
          @openChat="openChat"
          @exitChat="showExitConfirmation"
        ></chat-item>
      </div>
    </div>

    <!-- 채팅방 -->
    <div class="w-2/3 h-full p-4 bg-gray-100">
      <chat-room v-if="selectedChat" :chatId="selectedChatId"></chat-room>
      <div v-else class="text-center text-xl text-gray-400 mt-20">채팅을 선택하여 시작하세요!</div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'
import ChatItem from './ChatItem.vue'
import ChatRoom from './ChatRoom.vue'

export default {
  components: {
    ChatItem,
    ChatRoom
  },
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
  methods: {
    async fetchChatsForSelectedGym() {
      if (!this.selectedGymId) return

      const response = await api.get(`/gyms/${this.selectedGymId}/chats`)
      this.chats = response.data
    },
    openChat(chatId) {
      this.$router.push({ name: 'ChatRoom', params: { chatId: chatId } })
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
