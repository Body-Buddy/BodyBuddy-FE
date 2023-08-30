<template>
  <div class="profile-form bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">프로필 작성</h2>

    <div class="mb-4">
      <label class="block text-sm font-bold mb-2" for="nickname"
        >닉네임<span class="text-red-500">*</span></label
      >
      <input
        class="border w-full p-2 rounded"
        type="text"
        id="nickname"
        v-model="nickname"
        placeholder="닉네임을 입력하세요"
        required
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-bold mb-2" for="profileImage">프로필 이미지</label>
      <input type="file" id="profileImage" @change="onImageChange" />

      <div class="mt-2" v-if="imagePreview">
        <img :src="imagePreview" alt="Profile Preview" class="h-24 w-24 rounded-full border mb-2" />
        <button @click="removeImage" class="text-red-500">이미지 삭제</button>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-bold mb-2" for="introduction">소개글</label>
      <textarea
        class="border w-full p-2 rounded"
        id="introduction"
        v-model="introduction"
        rows="4"
        placeholder="자기소개를 작성하세요"
      ></textarea>
    </div>

    <div class="text-center">
      <button
        class="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-600"
        @click="submitProfile"
      >
        다음으로
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/axios.js'

export default {
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      nickname: '',
      introduction: '',
      profileImage: null,
      imagePreview: null
    }
  },
  methods: {
    onImageChange(event) {
      const file = event.target.files[0]
      this.profileImage = file
      this.imagePreview = URL.createObjectURL(file)
    },
    removeImage() {
      this.profileImage = null
      this.imagePreview = null
    },
    async uploadProfileImage() {
      if (!this.profileImage) {
        return
      }

      const formData = new FormData()
      formData.append('image', this.profileImage)

      try {
        await api.put(`/users/${this.userId}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (error) {
        console.error('프로필 이미지 업로드 중 오류 발생:', error)
      }
    },
    async submitProfile() {
      try {
        // 이미지 업로드
        await this.uploadProfileImage()

        // 프로필 데이터 전송
        await api.put(`/users/${this.userId}/profile`, {
          nickname: this.nickname,
          introduction: this.introduction
        })

        // 프로필 저장 성공 후 다음 페이지로 이동
        this.$router.push({ 
          path: '/matching/setup', 
          params: { userId: this.userId }
        });
      } catch (error) {
        console.error('프로필 저장 중 오류 발생:', error)
      }
    }
  }
}
</script>
