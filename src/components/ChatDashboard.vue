<template>
  <div class="flex h-full">
    <!-- 사이드바 -->
    <div class="w-1/3 border-r h-full">
      <div>
        <h2 class="p-6 text-2xl font-bold border-b">채팅</h2>

        <!-- 채팅 목록 -->
        <div
          v-for="chat in filteredChats"
          :key="chat.id"
          class="px-4 py-6 border-b cursor-pointer hover:bg-gray-100 flex items-center"
          @click="openChat(chat.id)"
        >
          <img
            :src="otherParticipant(chat).profileImage"
            alt="Participant's profile image"
            class="w-10 h-10 rounded-full mr-4"
          />
          <div class="flex-1 flex flex-col justify-center">
            <p class="font-bold mb-1">{{ otherParticipant(chat).nickname }}</p>
            <p class="text-sm text-gray-500 truncate">{{ chat.lastMessage.content }}</p>
          </div>
          <p class="text-xs text-gray-400">{{ formatDate(chat.lastMessage.sentAt) }}</p>
        </div>
      </div>
    </div>

    <!-- 채팅방 -->
    <div class="w-2/3 h-full">
      <router-view :key="$route.params.chatId" v-if="$route.params.chatId"></router-view>
      <div v-else class="text-center text-xl text-gray-400 mt-20">
        채팅을 선택하여 친구와 대화를 시작해보세요!
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  data() {
    return {
      chats: [],
      userId: this.$store.getters.getUser.id
    }
  },
  computed: {
    selectedGymId() {
      return this.$store.getters.getSelectedGymId
    },
    filteredChats() {
      return this.chats.filter((chat) => chat.lastMessage !== null)
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

      const response = await api.get(`/gym/${this.selectedGymId}/users/${this.userId}/chats`)
      this.chats = response.data
    },
    otherParticipant(chat) {
      if (chat && chat.participants) {
        return chat.participants.find((participant) => participant.id !== this.userId)
      }
      return null
    },
    isToday(date) {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    },
    isYesterday(date) {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      return date.toDateString() === yesterday.toDateString()
    },
    formatTime(date) {
      const hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      if (hours < 12) {
        return `오전 ${hours}:${minutes}`
      }
      return `오후 ${hours - 12}:${minutes}`
    },
    formatDate(dateString) {
      const inputDate = new Date(dateString)

      if (this.isToday(inputDate)) return this.formatTime(inputDate)
      if (this.isYesterday(inputDate)) return '어제'
      return `${inputDate.getMonth() + 1}월 ${inputDate.getDate()}일`
    },
    openChat(chatId) {
      this.$router.push(`/chats/${chatId}`)
    },
    async exitChatRoom(chatId) {
      await api.delete(`/chats/${chatId}/participants`)
      this.fetchChatsForSelectedGym()
    }
  }
}
</script>
