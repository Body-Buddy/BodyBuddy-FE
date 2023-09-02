<template>
  <div class="max-w-xl mx-auto mt-10">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <h2 class="text-2xl font-bold">채팅</h2>

        <!-- 헬스장 선택 드롭다운 -->
        <div class="relative ml-6">
          <select
            v-model="selectedGymId"
            @change="fetchChatsForSelectedGym"
            class="w-48 appearance-none p-2 border rounded"
          >
            <option v-for="gym in gyms" :key="gym.id" :value="gym.id">{{ gym.name }}</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 9.293L10 14.586l4.707-4.293-.707-.707L10 13.172 6 9.293l-.707.707z" />
            </svg>
          </div>
        </div>
      </div>

      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="openChat(chat.id)"
        @contextmenu.prevent="showExitConfirmation(chat.id)"
        class="mb-3 p-5 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-all duration-200 flex items-center space-x-4"
      >
        <!-- 패딩을 늘리고 rounded-lg로 변경, flex 아이템 정렬 및 공간 추가 -->

        <!-- 프로필 이미지 -->
        <img :src="chat.profileImage" alt="Friend's profile image" class="w-12 h-12 rounded-full" />
        <!-- 이미지 크기 조정 -->

        <div class="flex-grow">
          <!-- 친구 이름 -->
          <div class="chat-room-name text-lg font-bold mb-1">{{ chat.friendName }}</div>
          <!-- 마지막 메시지 -->
          <div class="last-message text-sm text-gray-600">{{ chat.lastMessage }}</div>
        </div>

        <!-- 마지막 메시지 시간 -->
        <div class="text-gray-400 text-xs self-start">{{ chat.lastMessageTime }}</div>
      </div>
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
          this.selectedGymId = this.gyms[0].id // 초기값으로 첫 번째 헬스장을 설정
          this.fetchFriendsForSelectedGym()
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
      // 해당 채팅방으로 이동하는 로직을 구현합니다.
      this.$router.push({ name: 'ChatRoom', params: { chatId: chatId } })
    },
    showExitConfirmation(chatId) {
      const isConfirmed = window.confirm('정말로 이 채팅방을 나가시겠습니까?')
      if (isConfirmed) {
        this.exitChatRoom(chatId)
      }
    },
    exitChatRoom(chatId) {
      // 여기에서 채팅방을 나가는 API 호출 또는 로직을 수행합니다.
      // 예시:
      // this.$axios.post(`/api/chats/${chatId}/exit`).then(() => {
      //   this.fetchChatList(); // 채팅방 목록 갱신
      // });
      console.log(`Exited chat room with ID: ${chatId}`)
      this.fetchChatList() // 채팅방 목록 갱신 (예시 코드)
    }
  }
}
</script>
