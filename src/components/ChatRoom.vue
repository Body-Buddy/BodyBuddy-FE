<template>
  <div class="container mx-auto px-4 py-6">
      <h2 class="text-2xl font-bold mb-6">채팅</h2>

      <div v-for="chat in chats" :key="chat.id" @click="openChat(chat.id)"
           @contextmenu.prevent="showExitConfirmation(chat.id)"
           class="p-4 bg-white rounded shadow-md cursor-pointer hover:bg-gray-100 transition-all duration-200 flex">
           
          <!-- 프로필 이미지 -->
          <img :src="chat.profileImage" alt="Friend's profile image" class="w-10 h-10 rounded-full mr-4">

          <div class="flex-grow">
              <!-- 친구 이름 -->
              <div class="chat-room-name text-lg font-bold">{{ chat.friendName }}</div>
              <!-- 마지막 메시지 -->
              <div class="last-message text-sm text-gray-600 mt-1">{{ chat.lastMessage }}</div>
          </div>
          
          <!-- 마지막 메시지 시간 -->
          <div class="text-gray-400 text-xs self-start">{{ chat.lastMessageTime }}</div>
      </div>
  </div>
</template>

<!-- 나머지 <script> 부분은 그대로 유지 -->

  
  <script>
  export default {
    data() {
      return {
        socket: null,
        messages: [],
        inputMessage: ''
      };
    },
    mounted() {
      // 웹소켓 연결
      this.socket = new WebSocket('ws://localhost:8080/chat');
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.receiveMessage(message);
      };
    },
    methods: {
      receiveMessage(message) {
        this.messages.push(message);
      },
      formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes()}`;
      },
      sendMessage() {
        if (this.inputMessage.trim()) {
          const message = {
            // 여기에 필요한 메시지 형식에 맞게 구성
            content: this.inputMessage
          };
          this.socket.send(JSON.stringify(message));
          this.inputMessage = '';
        }
      }
    }
  }
  </script>
  