<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <div class="p-4 bg-white border-b flex items-center">
      <img :src="chatInfo.profileImage" alt="Profile image" class="w-12 h-12 rounded-full" />
      <div class="ml-4">
        <div class="font-bold text-xl">{{ chatInfo.name }}</div>
        <div class="text-gray-600 text-sm">{{ chatInfo.status }}</div>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div class="flex-grow overflow-y-auto p-4 space-y-4">
      <div v-for="message in messages" :key="message.id" :class="{ self: message.isFromMe }">
        <div
          :class="
            message.isFromMe
              ? 'bg-blue-500 text-white rounded-xl p-3 align-right'
              : 'bg-gray-200 rounded-xl p-3'
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
          placeholder="Type a message..."
        />
        <button @click="sendMessage" class="ml-4 px-5 py-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  name: 'ChatRoom',
  props: {
    chatInfo: Object
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      socket: null
    }
  },
  async created() {
    try {
      const response = await api.get('/api/chat/messages') // API endpoint from Spring
      this.messages = response.data
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }

    this.initializeWebSocket()
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close()
    }
  },
  methods: {
    initializeWebSocket() {
      this.socket = new WebSocket('ws://localhost:8080/chat') // WebSocketHandler endpoint

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        this.messages.push(message)
      }

      this.socket.onclose = (event) => {
        if (event.wasClean) {
          console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`)
        } else {
          console.error('Connection died')
        }
      }

      this.socket.onerror = (error) => {
        console.error(`WebSocket Error: ${error}`)
      }
    },
    async sendMessage() {
      if (this.newMessage.trim()) {
        const messageData = {
          type: 'CHAT',
          chatId: this.chatInfo.chatId,
          senderUserId: this.chatInfo.userId,
          content: this.newMessage
        }

        this.socket.send(JSON.stringify(messageData))
        this.newMessage = ''
      }
    }
  }
}
</script>
