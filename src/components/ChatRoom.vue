<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <div class="p-4 bg-white flex items-center border-b">
      <img :src="chatInfo.profileImage" alt="Profile image" class="w-12 h-12 rounded-full" />
      <div class="ml-4">
        <div class="font-bold text-xl">{{ chatInfo.name }}</div>
        <div class="text-gray-600 text-sm">{{ chatInfo.status }}</div>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div class="flex-grow overflow-y-auto p-4 space-y-4">
      <div v-for="message in messages" 
      :key="message.id"
      class="flex" 
      :class="{ 'justify-end': isFromMe(message.senderNickname) }">
        <div class="px-4 py-2 rounded-xl"
          :class="
            isFromMe(message.senderNickname)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          "
        >
          {{ message.content }}
        </div>
      </div>
    </div>

    <!-- Chat Input Area -->
    <div class="border-t p-4">
      <div class="flex items-center">
        <input
          type="text"
          class="flex-grow p-3 rounded-lg border"
          v-model="newMessage"
          placeholder="메시지를 입력하세요..."
        />
        <button @click="sendMessage" class="ml-4 px-5 py-2 bg-gray-500 text-white rounded-lg">
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import api from '../api/axios.js'

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
      stompClient: null,
      chatId: this.$route.params.chatId,
      chatInfo: {
        name: '채팅방 이름',
        profileImage: 'https://via.placeholder.com/150',
        status: '채팅방 상태'
      }
    }
  },
  async created() {
    try {
      const response = await api.get(`/messages/past/${this.chatId}`)
      this.messages = response.data
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }

    this.initializeWebSocket()
  },
  beforeUnmount() {
    if (this.stompClient) {
      this.stompClient.disconnect()
    }
  },
  methods: {
    initializeWebSocket() {
      const socket = new SockJS('http://localhost:8080/ws/chat')
      this.stompClient = Stomp.over(socket)

      this.stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame)

        this.stompClient.subscribe(`/sub/messages/${this.chatId}`, (message) => {
          const parsedMessage = JSON.parse(message.body)
          this.messages.push(parsedMessage)
        })
      })
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        const messageData = {
          chatId: this.chatId,
          senderId: this.$store.getters.getUser.id,
          content: this.newMessage
        }

        this.stompClient.send(`/pub/messages/${this.chatId}`, {}, JSON.stringify(messageData))
        this.newMessage = ''
      }
    },
    isFromMe(senderNickname) {
      return senderNickname === this.$store.getters.getUser.nickname
    }
  }
}
</script>
