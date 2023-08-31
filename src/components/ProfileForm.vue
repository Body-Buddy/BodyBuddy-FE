<template>
  <div class="profile-form bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">프로필 작성</h2>

    <div class="mb-6">
      <label class="block text-sm font-bold mb-2" for="nickname"
        >닉네임<span class="text-red-500">*</span></label
      >
      <input
        :class="{ 'border-red-500': nicknameError }"
        class="border w-full p-2 rounded"
        type="text"
        id="nickname"
        v-model="nickname"
        placeholder="본명일수록 좋아요!"
        required
      />
      <p v-if="nicknameError" class="text-red-500 text-xs mt-2">닉네임은 필수로 입력해주세요.</p>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-bold mb-2" for="profileImage">프로필 이미지</label>
      <input type="file" id="profileImage" ref="fileInput" @change="onImageChange" />

      <div class="mt-2" v-if="imagePreview">
        <img :src="imagePreview" alt="Profile Preview" class="h-24 w-24 rounded-full border mb-2" />
        <button @click="removeImage" class="text-red-500">이미지 삭제</button>
      </div>
    </div>

    <div class="mb-6">
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
      imagePreview: null,
      nicknameError: false
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
      this.$refs.fileInput.value = '' // 파일 입력 필드 초기화
    },
    async uploadProfileImage() {
      if (!this.profileImage) {
        return
      }

      const formData = new FormData()
      formData.append('file', this.profileImage)

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
    async sendProfileData() {
      await api.put(`/users/${this.userId}/profile`, {
        nickname: this.nickname,
        introduction: this.introduction
      })
    },
    async submitProfile() {
      if (!this.nickname) {
        this.nicknameError = true
        return
      }
      try {
        await this.uploadProfileImage()
        await this.sendProfileData()

        this.$router.push({
          name: 'MatchingForm',
          params: { userId: this.userId }
        })
      } catch (error) {
        console.error('프로필 저장 중 오류 발생:', error)
      }
    }
  }
}
</script>
