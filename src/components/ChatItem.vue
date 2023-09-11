<template>
  <div
    @click="handleOpenChat"
    @contextmenu.prevent="handleExitChat"
    class="mb-3 p-5 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-all duration-200 flex items-center space-x-4"
  >
    <img :src="chat.profileImage" alt="Friend's profile image" class="w-12 h-12 rounded-full" />
    <div class="flex-grow">
      <div class="chat-room-name text-lg font-bold mb-1">{{ chat.friendName }}</div>
      <div class="last-message text-sm text-gray-600">{{ chat.lastMessage }}</div>
    </div>
    <div class="text-gray-400 text-xs self-start">{{ chat.lastMessageTime }}</div>
  </div>
</template>

<script>
export default {
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleOpenChat() {
      this.$emit('openChat', this.chat.id)
    },
    handleExitChat() {
      this.$emit('exitChat', this.chat.id)
    }
  }
}
</script>
