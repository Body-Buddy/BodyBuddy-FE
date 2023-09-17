<template>
  <div class="max-w-3xl mx-auto mt-10" v-if="post">
    <h2 class="text-2xl font-bold mb-4">글 수정하기</h2>

    <!-- 카테고리 선택 부분 -->
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2 text-gray-700">카테고리</label>
      <div class="w-48 relative">
        <select v-model="post.category" class="w-48 appearance-none p-2 border rounded">
          <option v-for="cat in categories" :key="cat.name" :value="cat.name">
            {{ cat.description }}
          </option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 9.293L10 14.586l4.707-4.293-.707-.707L10 13.172 6 9.293l-.707.707z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 제목 입력 부분 -->
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2 text-gray-700" for="title">제목</label>
      <input
        v-model="post.title"
        class="border p-2 w-full rounded focus:outline-none focus:border-blue-500"
        placeholder="제목을 입력하세요"
      />
    </div>

    <!-- 본문 입력 부분 -->
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2 text-gray-700" for="content">본문</label>
      <textarea
        v-model="post.content"
        rows="5"
        class="border p-2 w-full rounded focus:outline-none focus:border-blue-500"
        placeholder="본문을 입력하세요"
      ></textarea>
    </div>

    <!-- 기존 미디어 보여주기 및 삭제 -->
    <div class="mb-6 media-preview flex gap-2">
      <div v-for="(media, index) in post.medias" :key="media.id" class="relative">
        <img
          v-if="media.mediaType === 'IMAGE'"
          :src="media.s3Url"
          alt="media preview"
          class="h-32 w-32 object-cover rounded shadow m-2"
        />
        <video v-if="media.mediaType === 'VIDEO'" controls class="h-32 w-32 rounded shadow m-2">
          <source :src="media.s3Url" type="video/mp4" />
        </video>
        <button
          @click="deleteMedia(index)"
          class="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 transition-colors focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>

    <!-- 새 미디어 추가 -->
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2 text-gray-700">새로운 사진 또는 동영상 추가</label>
      <input type="file" multiple ref="mediaInput" @change="uploadMedia" style="display: none" />
      <button
        @click="addMedia"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors mb-2 focus:outline-none"
      >
        파일 추가
      </button>
    </div>

    <!-- 저장 버튼 -->
    <div class="p-8 w-full mx-auto relative">
      <button
        @click="savePost"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none absolute bottom-4 right-4"
      >
        저장하기
      </button>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  data() {
    return {
      post: null,
      categories: []
    }
  },
  async mounted() {
    await Promise.all([this.getCategories(), this.getPost()])
  },
  methods: {
    async getCategories() {
      const response = await api.get('/categories')
      this.categories = response.data
    },
    async getPost() {
      const postId = this.$route.params.postId
      const response = await api.get(`/posts/${postId}`)
      this.post = response.data
    },
    async savePost() {
      // 수정된 게시글 데이터를 서버에 업데이트합니다.
      await api.put(`/posts/${this.postId}`, this.post)
      this.$router.push(`/posts/${this.postId}`)
    },
    async deleteMedia(mediaId) {
      // 선택된 미디어를 삭제합니다.
      await api.delete(`/medias/${mediaId}`)
      this.getPost(this.postId) // 게시글 정보를 다시 가져옵니다.
    },
    async uploadMedia(event) {
      const file = event.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('media', file)

      await api.post(`/medias/upload`, formData)
      this.getPost(this.postId) // 게시글 정보를 다시 가져옵니다.
    }
  }
}
</script>
