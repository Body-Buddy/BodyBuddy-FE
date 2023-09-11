<template>
  <div class="max-w-xl mx-auto mt-10">
    <div class="flex justify-between items-center mb-6">
      
      <div class="flex items-center">
        <h2 class="text-2xl font-bold">게시판</h2>

        <!-- 헬스장 선택 드롭다운 -->
        <div class="relative ml-6">
          <select
            v-model="selectedGymId"
            @change="fetchPostsForSelectedGym"
            class="w-48 appearance-none p-2 border rounded"
          >
            <option v-for="gym in gyms" :key="gym.id" :value="gym.id">{{ gym.name }}</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 9.293L10 14.586l4.707-4.293-.707-.707L10 13.172 6 9.293l-.707.707z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 검색 바 -->
      <div class="relative w-64">
        <input type="text" class="w-full p-2 border rounded" placeholder="게시글 검색..." />
        <div class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <i class="fas fa-search"></i>
        </div>
      </div>
    </div>

    <div class="flex justify-end mb-4">
      <button
        @click="writePost"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        글쓰기
      </button>
    </div>
    <div class="post bg-white p-6 mt-4 rounded-lg shadow-md" v-for="post in posts" :key="post.id">
      <!-- 게시글 내용 -->
      <h2 class="text-2xl font-bold mb-4">{{ post.title }}</h2>
      <p class="mb-4">{{ post.content }}</p>
      <div class="post-footer flex justify-between items-center text-gray-500 text-sm mb-4">
        <span>{{ post.author }}</span>
        <span>{{ post.createdAt }}</span>
      </div>
    </div>

    <!-- 페이징 처리 -->
    <div class="pagination mt-6 flex justify-center space-x-2">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-4 py-2 border rounded"
      >
        이전
      </button>
      <span class="px-4 py-2 bg-gray-200 text-gray-700 rounded">{{ currentPage }}</span>
      <button @click="goToPage(currentPage + 1)" class="px-4 py-2 border rounded">다음</button>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  data() {
    return {
      posts: [],
      currentPage: 1,
      gyms: [],
      selectedGymId: null
    }
  },
  mounted() {
    this.fetchUserGyms()
  },
  methods: {
    async fetchUserGyms() {
      try {
        const response = await api.get(`/users/${this.userId}/gyms`)
        this.gyms = response.data
        if (this.gyms.length > 0) {
          this.selectedGymId = this.gyms[0].id
          this.fetchPostsForSelectedGym()
        }
      } catch (error) {
        console.error('헬스장 목록을 가져오는 중 오류 발생:', error)
      }
    },
    async fetchPostsForSelectedGym() {
      if (!this.selectedGymId) return
      try {
        const response = await api.get(`/gyms/${this.selectedGymId}/posts`)
        this.posts = response.data
      } catch (error) {
        console.error('게시글 목록을 가져오는 중 오류 발생:', error)
      }
    },
    writePost() {
      this.$router.push({ name: 'PostForm', params: { gymId: this.selectedGymId } })
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber
    }
  }
}
</script>
