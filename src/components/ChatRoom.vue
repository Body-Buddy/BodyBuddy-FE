<template>
  <div class="flex flex-col h-full">
    <div class="p-4 bg-white flex items-center border-b justify-between">
      <div class="flex items-center">
        <img
          :src="otherParticipant?.profileImage"
          alt="Profile image"
          class="w-12 h-12 rounded-full"
        />
        <div class="ml-4">
          <div class="font-bold text-lg">{{ otherParticipant?.nickname }}</div>
          <div class="text-gray-600 text-sm">{{ friendshipDuration }}</div>
        </div>
      </div>

      <div class="relative">
        <button @click="toggleMenu" class="focus:outline-none">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
        <div
          v-if="showMenu"
          class="absolute right-0 top-full mt-2 w-48 bg-white border rounded shadow-xl z-10"
        >
          <button @click="leaveChatRoom" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
            채팅방 나가기
          </button>
          <button @click="blockUser" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
            친구 차단하기
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div class="flex-grow overflow-y-auto p-4 space-y-4">
      <div v-for="(message, index) in messages" :key="message.id">
        <!-- Date separator -->
        <div v-if="isNewDay(index)" class="w-full text-center my-4">
          <span class="bg-white px-4 text-sm text-gray-500">
            {{ formatDate(messages[index].sentAt) }}
          </span>
        </div>

        <div class="flex items-end" :class="{ 'justify-end': isFromMe(message.sender.id) }">
          <!-- If the message is from me, display time on the left -->
          <div v-if="isFromMe(message.sender.id)" class="text-xs mr-2 text-gray-400">
            {{ formatTime(message.sentAt) }}
          </div>

          <div
            class="px-4 py-2 rounded-xl"
            :class="isFromMe(message.sender.id) ? 'bg-blue-500 text-white' : 'bg-gray-200'"
          >
            {{ message.content }}
          </div>

          <!-- If the message is from the other user, display time on the right -->
          <div v-if="!isFromMe(message.sender.id)" class="text-xs ml-2 text-gray-400">
            {{ formatTime(message.sentAt) }}
          </div>
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
      chat: null,
      chatId: this.$route.params.chatId,
      messages: [],
      newMessage: '',
      stompClient: null,
      showMenu: false
    }
  },
  async created() {
    this.chat = (await api.get(`/chats/${this.chatId}`)).data
    this.messages = (await api.get(`/chats/${this.chatId}/messages`)).data
    console.log(this.chat)
    this.initializeWebSocket()
  },
  beforeUnmount() {
    if (this.stompClient) {
      this.stompClient.disconnect()
    }
  },
  computed: {
    otherParticipant() {
      if (this.chat && this.chat.participants) {
        return this.chat.participants.find(
          (participant) => participant.id !== this.$store.getters.getUser.id
        )
      }
      return null
    },
    friendshipDuration() {
      if (this.chat && this.chat.createdAt) {
        const currentDate = new Date()
        const friendshipDate = new Date(this.chat.createdAt)

        const diffTime = currentDate - friendshipDate
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        if (diffDays < 1) {
          return `${diffHours}시간 전 친구가 되었어요.`
        } else if (diffDays < 30) {
          return `${diffDays}일 전 친구가 되었어요.`
        } else if (diffDays < 365) {
          const diffMonths = Math.floor(diffDays / 30)
          return `${diffMonths}개월 전 친구가 되었어요.`
        } else {
          const diffYears = Math.floor(diffDays / 365)
          return `${diffYears}년 전 친구가 되었어요.`
        }
      }
      return ''
    }
  },
  methods: {
    initializeWebSocket() {
      const socket = new SockJS('http://localhost:8080/ws/chat')
      this.stompClient = Stomp.over(socket)

      this.stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame)

        this.stompClient.subscribe(`/sub/chats/${this.chatId}`, (message) => {
          const parsedMessage = JSON.parse(message.body)
          this.messages.push(parsedMessage)
        })
      })
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        const messageData = {
          senderId: this.$store.getters.getUser.id,
          content: this.newMessage
        }

        this.stompClient.send(`/pub/chats/${this.chatId}/send`, {}, JSON.stringify(messageData))
        this.newMessage = ''
      }
    },
    isFromMe(senderId) {
      return senderId === this.$store.getters.getUser.id
    },
    leaveChatRoom() {
      this.showMenu = false
    },
    blockUser() {
      this.showMenu = false
    },
    isNewDay(index) {
      if (index === 0) return true
      console.log(this.messages[index - 1])
      const previousDate = new Date(this.messages[index - 1].sentAt).toDateString()
      const currentDate = new Date(this.messages[index].sentAt).toDateString()
      return previousDate !== currentDate
    },
    formatDate(dateString) {
      const date = new Date(dateString)

      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
      const dayOfWeek = daysOfWeek[date.getDay()]

      return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`
    },
    formatTime(dateString) {
      const date = new Date(dateString)
      const hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      if (hours < 12) {
        return `오전 ${hours}:${minutes}`
      }
      return `오후 ${hours - 12}:${minutes}`
    }
  }
}
</script>
