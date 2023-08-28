<template>
    <div>
      <div v-for="message in messages" :key="message.id">
        <p>{{ message.sender }}: {{ message.content }}</p>
      </div>
      <input v-model="currentMessage" @keyup.enter="sendMessage" />
      <button @click="sendMessage">Send</button>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  
  export default {
    data() {
      return {
        socket: null,
        messages: [],
        currentMessage: ''
      };
    },
    mounted() {
      this.initializeSocket();
    },
    methods: {
      initializeSocket() {
        this.socket = io('http://localhost:8080'); // 백엔드 서버 URL
  
        this.socket.on('connect', () => {
          console.log('Connected to the server');
  
          // 입장 메시지 전송
          this.socket.emit('message', {
            type: 'ENTER',
            senderId: 'YOUR_USER_ID', // TODO: 실제 사용자 ID로 변경
            chatId: 'YOUR_CHAT_ID' // TODO: 실제 채팅방 ID로 변경
          });
        });
  
        this.socket.on('message', (message) => {
          this.messages.push(message);
        });
      },
      sendMessage() {
        this.socket.emit('message', {
          type: 'TALK',
          senderId: 'YOUR_USER_ID', // TODO: 실제 사용자 ID로 변경
          chatId: 'YOUR_CHAT_ID', // TODO: 실제 채팅방 ID로 변경
          content: this.currentMessage
        });
        this.currentMessage = '';
      }
    },
    beforeDestroy() {
      if (this.socket) {
        this.socket.emit('message', {
          type: 'LEAVE',
          senderId: 'YOUR_USER_ID', // TODO: 실제 사용자 ID로 변경
          chatId: 'YOUR_CHAT_ID' // TODO: 실제 채팅방 ID로 변경
        });
        this.socket.disconnect();
      }
    }
  };
  </script>
  