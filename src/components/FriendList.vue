<template>
  <div class="space-y-4">
    <div v-for="friend in friends" :key="friend.id" class="flex items-center space-x-4 bg-white p-4 rounded shadow-md">
      <img :src="friend.profileImage" alt="Profile Image" class="w-12 h-12 rounded-full"/>
      <div class="flex-grow flex flex-col">
        <div class="text-lg font-semibold">{{ friend.nickname }}</div>
        <div class="text-sm text-gray-500">{{ friend.description }}</div>
      </div>
      <button @click="startChat(friend.id)" class="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50">채팅하기</button>
    </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        friends: []  // 이 배열은 API에서 가져온 친구 목록 데이터로 채워질 것입니다.
      };
    },
    methods: {
      async fetchFriends() {
        // API에서 친구 목록 데이터를 가져오는 코드를 여기에 작성합니다.
        // 예시: this.friends = await fetchApi('/api/friends');
      },
      startChat(friendId) {
        // 친구와의 채팅을 시작하는 로직을 여기에 구현합니다.
        // 예: this.$router.push(`/chats/private/${friendId}`);
      }
    },
    mounted() {
      this.fetchFriends();
    }
  }
  </script>

  