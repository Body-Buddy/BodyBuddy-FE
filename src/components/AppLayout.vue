<template>
    <div class="h-screen flex flex-col">
      <router-view></router-view>
  
      <div class="fixed bottom-0 w-full flex justify-between px-5 py-3 bg-gray-200 border-t border-gray-300 shadow-lg">
        <router-link 
          to="/friends" 
          class="tab-button flex-grow text-center font-medium text-gray-500 hover:text-blue-500 transition-colors"
          :class="{ 'text-blue-500': $route.path === '/friends' }">
          친구 찾기
        </router-link>
        <router-link 
          to="/chats" 
          class="tab-button flex-grow text-center font-medium text-gray-500 hover:text-blue-500 transition-colors"
          :class="{ 'text-blue-500': $route.path === '/chats' }">
          1:1 채팅
        </router-link>
        <router-link 
          to="/posts" 
          class="tab-button flex-grow text-center font-medium text-gray-500 hover:text-blue-500 transition-colors"
          :class="{ 'text-blue-500': $route.path === '/posts' }">
          게시판
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AppLayout'
  }
  </script>
  