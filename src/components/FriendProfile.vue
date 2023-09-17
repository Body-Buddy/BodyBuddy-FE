<template>
  <div class="flex items-center mb-4">
    <img :src="profileImageUrl" alt="프로필 이미지" class="w-24 h-24 rounded-full flex-none mr-4" />

    <div class="flex-col ml-4">
      <div class="flex-grow text-lg font-semibold mb-2">{{ friend.nickname }}</div>
      <div class="text-gray-500 mb-4 intro-text">{{ friend.introduction }}</div>
    </div>
    <button @click="startChatWithFriend" class="ml-auto btn-start-chat">
      <i class="w-24 fas fa-paper-plane"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    friend: {
      type: Object,
      required: true
    }
  },
  computed: {
    profileImageUrl() {
      return this.friend.profileImage
        ? this.friend.profileImage
        : '/default-profile.png'
    }
  },
  methods: {
    startChatWithFriend() {
      this.$emit('startChat', this.friend.id)
    }
  }
}
</script>

<style scoped>
.btn-start-chat {
  background-color: #3b82f6;
  color: white;
  border-radius: 9999px;
  height: 2rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s,
    background-color 0.2s;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

&:hover {
  background-color: #2563eb;
  transform: scale(1.1);
}

&:active {
  background-color: #1e40af;
  transform: scale(1);
}

&:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.intro-text {
  max-width: 500px; 
}
</style>

