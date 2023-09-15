<template>
  <div class="max-w-xl mx-auto mt-10">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">게시판</h2>

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

    <div
      class="post bg-white p-6 mt-4 rounded-lg shadow-md cursor-pointer"
      v-for="post in posts"
      :key="post.id"
      @click="goToPost(post.id)"
    >
      <!-- 게시글 내용 -->
      <h2 class="text-2xl font-bold mb-4">{{ post.title }}</h2>
      <p class="mb-4">{{ post.content }}</p>
      <div class="post-footer flex justify-between items-center text-gray-500 text-sm mb-4">
        <span>{{ post.author.nickname }}</span>
        <span>{{ post.createdAt }}</span>
        <span>{{ post.likeCount }}</span>
        <span>{{ post.commentCount }}</span>
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
      likedPostIds: []
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
      this.posts = response.data
    },
    writePost() {
      this.$router.push('/posts/write')
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`)
    }
  }
}
</script>
