<template>
    <div class="chat-list space-y-6 px-4 py-6 bg-gray-100 min-h-screen pt-8 pb-20"> <!-- 모바일에 적합하게 패딩 추가 -->
        <h2 class="text-2xl font-bold mb-6">채팅</h2>

        <div v-for="chat in chats" :key="chat.id" @click="openChat(chat.id)"
             @contextmenu.prevent="showExitConfirmation(chat.id)"
             class="p-5 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-all duration-200 flex items-center space-x-4"> <!-- 패딩을 늘리고 rounded-lg로 변경, flex 아이템 정렬 및 공간 추가 -->

            <!-- 프로필 이미지 -->
            <img :src="chat.profileImage" alt="Friend's profile image" class="w-12 h-12 rounded-full"> <!-- 이미지 크기 조정 -->

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
</template>

<script>
import api from '@/axios.js'

export default {
  data() {
    return {
      chats: [] // 이곳에 채팅방 목록 정보를 저장합니다.
    }
  },
  mounted() {
    this.fetchChatList()
  },
  methods: {
    fetchChatList() {
      // API로부터 채팅방 목록 정보를 가져와 chats 데이터에 저장하는 로직을 구현합니다.
      this.chats = [
        {
          id: 1,
          friendName: 'Alice',
          profileImage: 'path_to_image_of_Alice',
          lastMessage: 'Hello',
          lastMessageTime: '10:05 AM'
        },
        {
          id: 2,
          friendName: 'Bob',
          profileImage: 'path_to_image_of_Bob',
          lastMessage: 'Hi',
          lastMessageTime: '09:30 AM'
        }
        // ... 기타 채팅방들
      ]
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
