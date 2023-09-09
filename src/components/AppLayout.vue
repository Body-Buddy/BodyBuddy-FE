<template>
  <div class="h-screen flex flex-col">
    <!-- 상단 네비게이션 바 -->
    <nav class="p-4 shadow-md">
      <div class="mx-6 mx-auto flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold text-gray-800 ml-2">💪🏻 바디버디</router-link>

        <div class="space-x-10 mr-10">
          <router-link
            to="/friends"
            class="text-gray-800 hover:text-gray-600"
            :class="{ 'text-gray-600': $route.path !== '/friends' }"
            >친구 찾기</router-link
          >
          <router-link
            to="/chats"
            class="text-gray-800 hover:text-gray-600"
            :class="{ 'text-gray-600': $route.path !== '/chats' }"
            >채팅하기</router-link
          >
          <router-link
            to="/posts"
            class="text-gray-800 hover:text-gray-600"
            :class="{ 'text-gray-600': $route.path !== '/posts' }"
            >게시판</router-link
          >
          <router-link
            :to="authLink.path"
            class="text-gray-800 hover:text-gray-600"
            :class="{ 'text-gray-600': $route.path !== authLink.path }"
            >{{ authLink.text }}</router-link
          >
        </div>
      </div>
    </nav>

    <!-- 주요 페이지 내용이 들어가는 부분 (router-view) -->
    <div class="h-full overflow-y-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import tokenManager from '../tokenManager';

export default {
  name: 'AppLayout',
  mounted() {
    tokenManager.loadAccessToken()
    this.token = tokenManager.getAccessToken()
  },
  data() {
    return {
      token: null
    }
  },
  computed: {
    authLink() {
      return this.token
        ? { path: "/mypage", text: "마이페이지" }
        : { path: "/login", text: "로그인" };
    }
  }
}
</script>
