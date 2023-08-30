<template>
  <div class="chat-container bg-white border border-gray-200 rounded-lg shadow-md flex flex-col">
    <div class="chat-header bg-gray-100 p-4 border-b border-gray-200 text-center">
      <h3 class="font-bold">Chat Room</h3>
    </div>

    <div class="chat-messages flex-grow overflow-y-auto p-4">
      <div v-for="message in messages" :key="message.sentAt" class="message flex items-center space-x-4 mb-4">
        <img :src="message.profileImage" alt="Profile Image" class="profile-image w-10 h-10 rounded-full">
        <div class="message-details flex flex-col">
          <span class="nickname font-semibold">{{ message.nickname }}</span>
          <span class="content text-gray-800">{{ message.content }}</span>
          <span class="timestamp text-gray-500 text-xs">{{ formatDate(message.sentAt) }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input flex p-4 space-x-4 border-t border-gray-200">
      <input type="text" v-model="inputMessage" @keyup.enter="sendMessage" 
             class="flex-grow p-2 border border-gray-300 rounded-l">
      <button @click="sendMessage" 
              class="text-white bg-blue-500 px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50">Send</button>
    </div>
  </div>
</template>
  
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
  