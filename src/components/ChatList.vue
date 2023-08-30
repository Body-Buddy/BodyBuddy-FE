<template>
    <div class="chat-list space-y-4">
        <div v-for="chat in chats" :key="chat.id" @click="openChat(chat.id)"
             @contextmenu.prevent="showExitConfirmation(chat.id)"
             class="p-4 bg-white rounded shadow-md cursor-pointer hover:bg-gray-100 transition-all duration-200">
            <div class="chat-room-name text-lg font-bold">{{ chat.roomName }}</div>
            <div class="last-message text-sm text-gray-600 mt-1">{{ chat.lastMessage }}</div>
        </div>
    </div>
</template>
  
<script>
import api from '@/axios.js';

export default {
    data() {
        return {
            chats: [] // 이곳에 채팅방 목록 정보를 저장합니다.
        }
    },
    mounted() {
        this.fetchChatList();
    },
    methods: {
        fetchChatList() {
            // API로부터 채팅방 목록 정보를 가져와 chats 데이터에 저장하는 로직을 구현합니다.
            // 예시로는 임시 데이터를 사용하겠습니다.
            this.chats = [
                { id: 1, roomName: 'Room 1', lastMessage: 'Hello' },
                { id: 2, roomName: 'Room 2', lastMessage: 'Hi' },
                // ... 기타 채팅방들
            ];
        },
        openChat(chatId) {
            // 해당 채팅방으로 이동하는 로직을 구현합니다.
            this.$router.push({ name: 'ChatRoom', params: { chatId: chatId } });
        },
        showExitConfirmation(chatId) {
            const isConfirmed = window.confirm('정말로 이 채팅방을 나가시겠습니까?');
            if (isConfirmed) {
                this.exitChatRoom(chatId);
            }
        },
        exitChatRoom(chatId) {
            // 여기에서 채팅방을 나가는 API 호출 또는 로직을 수행합니다.
            // 예시: 
            // this.$axios.post(`/api/chats/${chatId}/exit`).then(() => {
            //   this.fetchChatList(); // 채팅방 목록 갱신
            // });
            console.log(`Exited chat room with ID: ${chatId}`);
            this.fetchChatList(); // 채팅방 목록 갱신 (예시 코드)
        }
    }
}
</script>
  