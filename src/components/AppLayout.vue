<template>
  <div class="h-screen flex flex-col">
    <!-- 상단 네비게이션 바 -->
    <nav class="p-4 border-b">
      <div class="mx-6 mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <router-link to="/" class="text-xl font-bold text-gray-800 ml-2">💪🏻 바디버디</router-link>

          <!-- 헬스장 선택 드롭다운 -->
          <div class="relative">
            <select
              :value="selectedGymId"
              @input="handleGymChange"
              class="w-48 p-2 bg-white rounded focus:outline-none focus:ring focus:ring-opacity-50 hover:bg-gray-100 appearance-none"
              :disabled="!showGymDropdown"
            >
              <option v-for="gym in gyms" :key="gym.id" :value="gym.id">{{ gym.name }}</option>
            </select>
            <i
              class="fa-solid fa-chevron-down absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
            ></i>
          </div>
        </div>

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
          <button v-if="showLogout" @click="logout" class="text-gray-800 hover:text-gray-600">
            로그아웃
          </button>
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
import api from '../api/axios.js'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      token: null,
      showLogout: false
    }
  },
  computed: {
    ...mapState(['selectedGymId', 'gyms']),
    showGymDropdown() {
      return ['/friends', '/chats', '/posts'].includes(this.$route.path)
    },
    authLink() {
      return this.token
        ? { path: '/mypage', text: '마이페이지' }
        : { path: '/login', text: '로그인' }
    }
  },
  watch: {
    $route() {
      if (this.showGymDropdown) {
        this.$store.dispatch('fetchUserGyms')
      }
    }
  },
  async mounted() {
    this.token = this.$store.getters.getAccessToken
    this.showLogout = !!this.token
  },
  methods: {
    async logout() {
      await api.post('/auth/logout', { refreshToken: Cookies.get('refreshToken') })
      this.deleteCookie('refreshToken')

      this.$router.push('/login')
      this.showLogout = false
      this.token = null
    },
    deleteCookie(name) {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
    handleGymChange(event) {
      const newSelectedGymId = event.target.value
      this.$store.dispatch('updateSelectedGymId', newSelectedGymId)
    }
  }
}
</script>

<style scoped>
  select:disabled {
    background-color: #f1f3f5;
    opacity: 0.7;
  }
</style>
