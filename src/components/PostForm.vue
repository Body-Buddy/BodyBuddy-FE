<template>
  <div class="max-w-3xl mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">글 작성하기</h2>

    <!-- 카테고리 선택 부분 -->
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2 text-gray-700">카테고리</label>
      <div class="w-48 relative">
        <select v-model="category" class="w-48 appearance-none p-2 border rounded">
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
        v-model="title"
        class="border p-2 w-full rounded focus:outline-none focus:border-blue-500"
        id="title"
        placeholder="제목을 입력하세요"
      />
    </div>

    <!-- 본문 입력 부분 -->
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2 text-gray-700" for="content">본문</label>
      <textarea
        v-model="content"
        rows="5"
        class="border p-2 w-full rounded focus:outline-none focus:border-blue-500"
        id="content"
        placeholder="본문을 입력하세요"
      ></textarea>
    </div>

    <!-- 이미지 및 비디오 추가 부분 -->
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2 text-gray-700">사진 또는 동영상</label>
      <input
        type="file"
        multiple
        ref="mediaInput"
        @change="handleMediaFiles"
        style="display: none"
      />
      <button
        @click="addMedia"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors mb-2 focus:outline-none"
      >
        파일 추가
      </button>

      <div class="media-preview flex gap-2">
        <div v-for="(media, index) in mediaFiles" :key="media.name" class="relative">
          <img
            v-if="media.type.includes('image')"
            :src="media.url"
            alt="media preview"
            class="h-32 w-32 object-cover rounded shadow m-2"
          />
          <video v-if="media.type.includes('video')" controls class="h-32 w-32 rounded shadow m-2">
            <source :src="media.url" :type="media.type" />
          </video>
          <button
            @click="removeMedia(index)"
            class="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 transition-colors focus:outline-none"
          >
            &times;
          </button>
        </div>
      </div>
    </div>

    <!-- 게시 버튼 -->
    <div class="p-8 w-full mx-auto relative">
      <button
        @click="submitPost"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none absolute bottom-4 right-4"
      >
        게시하기
      </button>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  data() {
    return {
      title: '',
      content: '',
      category: '',
      mediaFiles: [],
      categories: []
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
        this.fetchChatsForSelectedGym()
      }
    }
  },
  mounted() {
    this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      const response = await api.get('/categories')
      this.categories = response.data
    },
    addMedia() {
      this.$refs.mediaInput.click()
    },
    removeMedia(index) {
      this.mediaFiles.splice(index, 1)
    },
    handleMediaFiles(event) {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const url = URL.createObjectURL(file)
        this.mediaFiles.push({ name: file.name, type: file.type, url: url })
      }
    },
    async submitPost() {
      if(this.title === '' || this.content === '' || this.category === '') {
        window.alert('제목, 내용, 카테고리는 필수 입력 사항입니다.')
        return
      }
      const response = await api.post(`/posts`, {
        title: this.title,
        content: this.content,
        category: this.category,
        mediaFiles: this.mediaFiles,
        gymId: this.selectedGymId
      })

      console.log(response)

      if (response.status === 201) {
        window.alert('게시글이 성공적으로 등록되었습니다.')
      }

      this.$router.push('/posts')
    }
  }
}
</script>
