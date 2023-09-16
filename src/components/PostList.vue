<template>
  <div class="max-w-3xl mx-auto mt-10">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">게시판</h2>

      <!-- 검색 바 -->
      <div class="relative w-64">
        <input
          type="text"
          class="w-full p-2 border rounded"
          placeholder="게시글 검색..."
          v-model="searchQuery"
          @keyup.enter="searchPosts"
        />
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
        <i class="fas fa-pencil-alt mr-2"></i>글쓰기
      </button>
    </div>

    <div
      class="post bg-white p-6 mt-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
      v-for="post in posts"
      :key="post.id"
      @click="goToPost(post.id)"
    >
      <!-- 게시글 내용 -->
      <h2 class="text-xl font-bold mb-4">{{ post.title }}</h2>

      <p class="mb-8">{{ truncateText(post.content, 200) }}</p>
      <div class="post-footer flex justify-between items-center text-gray-500 text-sm mb-2">
        <div class="flex space-x-4 items-center">
          <img
            :src="post.author.profileImage"
            alt="Author's profile image"
            class="w-6 h-6 rounded-full"
          />
          <span>{{ post.author.nickname }}</span>
        </div>
        <div class="flex space-x-4">
          <span>{{ formatDate(post.createdAt) }}</span>
          <span class="flex items-center"
            ><i class="fas fa-thumbs-up mr-1"></i>{{ post.likeCount }}</span
          >
          <span class="flex items-center"
            ><i class="fas fa-comment mr-1"></i>{{ post.commentCount }}</span
          >
        </div>
      </div>
    </div>

    <!-- 페이징 처리 -->
    <div class="pagination mt-6 flex justify-center space-x-2">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
      >
        이전
      </button>
      <span class="px-4 py-2 bg-gray-200 text-gray-700 rounded">{{ currentPage }}</span>
      <button
        @click="goToPage(currentPage + 1)"
        class="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
      >
        다음
      </button>
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
      searchQuery: ''
    }
  },
  computed: {
    selectedGymId() {
      return this.$store.getters.getSelectedGymId
    }
  },
  watch: {
    selectedGymId(newGymId, oldGymId) {
      if (newGymId !== oldGymId) {
        this.fetchPostsForSelectedGym()
      }
    }
  },
  mounted() {
    this.fetchPostsForSelectedGym()
  },
  methods: {
    async fetchPostsForSelectedGym() {
      if (!this.selectedGymId) return
      const response = await api.get(`/gyms/${this.selectedGymId}/posts`)
      this.posts = response.data.content
    },
    async searchPosts() {
      if (!this.searchQuery.trim()) return
      const response = await api.get(`/posts/search`, {
        params: {
          keyword: this.searchQuery
        }
      })
      this.posts = response.data.content
    },
    writePost() {
      this.$router.push('/posts/write')
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`)
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}/${month}/${day} ${hours}:${minutes}`
    },
    truncateText(text, maxLength) {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
    }
  }
}
</script>
