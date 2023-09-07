<template>
  <div class="flex h-full">
    <!-- Sidebar (Chat List) -->
    <div class="w-1/3 border-r h-full">
      <div class="p-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">채팅</h2>
          <!-- 헬스장 선택 드롭다운 -->
          <div class="relative">
            <select
              v-model="selectedGymId"
              @change="fetchChatsForSelectedGym"
              class="w-48 appearance-none p-2 border rounded"
            >
              <option v-for="gym in gyms" :key="gym.id" :value="gym.id">{{ gym.name }}</option>
            </select>
          </div>
        </div>

        <div
          v-for="chat in chats"
          :key="chat.id"
          @click="openChat(chat.id)"
          @contextmenu.prevent="showExitConfirmation(chat.id)"
          class="mb-3 p-5 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-all duration-200 flex items-center space-x-4"
        >
          <img
            :src="chat.profileImage"
            alt="Friend's profile image"
            class="w-12 h-12 rounded-full"
          />
          <div class="flex-grow">
            <div class="chat-room-name text-lg font-bold mb-1">{{ chat.friendName }}</div>
            <div class="last-message text-sm text-gray-600">{{ chat.lastMessage }}</div>
          </div>
          <div class="text-gray-400 text-xs self-start">{{ chat.lastMessageTime }}</div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="w-2/3 h-full p-4 bg-gray-100">
      <!-- Place your chat component here. e.g. <chat-room v-if="selectedChat" :chatId="selectedChatId"></chat-room> -->
      <!-- If no chat is selected, you can show a prompt message. e.g. "Select a chat to start messaging!" -->
    </div>
  </div>
</template>

<script>
import api from '@/axios.js'

export default {
  data() {
    return {
      chats: [],
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
          this.selectedGymId = this.gyms[0].id
          this.fetchChatsForSelectedGym()
        }
      } catch (error) {
        console.error('헬스장 목록을 가져오는 중 오류 발생:', error)
      }
    },
    async fetchChatsForSelectedGym() {
      if (!this.selectedGymId) return
      try {
        const response = await api.get(`/gyms/${this.selectedGymId}/chats`)
        this.chats = response.data
      } catch (error) {
        console.error('채팅 목록을 가져오는 중 오류 발생:', error)
      }
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
      try {
        await api.delete(`/api/chats/${chatId}/joiners`)
        this.fetchChatsForSelectedGym() // 채팅방 목록 갱신
      } catch (error) {
        console.error('채팅방 나가기 중 오류 발생:', error)
      }
    }
  }
}
</script>
