<template>
  <div class="max-w-xl mx-auto mt-10">
    <div class="mb-4">
      <p class="text-blue-500 text-3xl tracking-wide font-extrabold mb-2">2/3</p>
      <p class="font-bold text-2xl mb-2">프로필을 등록해주세요.</p>
      <p class="text-gray-600">함께 운동할 친구에게 자기소개를 해볼까요?</p>
    </div>

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
        placeholder="본명일수록 좋아요."
        required
      />
      <p v-if="nicknameError" class="text-red-500 text-xs mt-2">닉네임은 필수로 입력해주세요.</p>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-bold mb-2" for="profileImage">프로필 이미지</label>
      <input type="file" id="profileImage" ref="fileInput" @change="onImageChange" />
      <div class="flex">
        <div class="mt-2 relative" v-if="imagePreview">
          <img
            :src="imagePreview"
            alt="Profile Preview"
            class="h-32 w-32 object-cover rounded shadow m-2"
          />
          <button
            @click="removeImage"
            class="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 transition-colors focus:outline-none"
          >
            &times;
          </button>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-bold mb-2" for="introduction">소개글</label>
      <textarea
        class="border w-full p-2 rounded"
        id="introduction"
        v-model="introduction"
        rows="4"
        placeholder="자신을 소개해주세요."
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
import tokenManager from '../tokenManager'

export default {
  data() {
    return {
      user: null,
      nickname: '',
      introduction: '',
      profileImage: null,
      imagePreview: null,
      nicknameError: false
    }
  },
  mounted() {
    tokenManager.loadTokenFromCookie()
    this.getUser()
  },
  methods: {
    async getUser() {
      const response = await api.get('/auth/user')
      console.log(response.data)
      this.user = response.data
    },
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
        await api.put(`/users/${this.user.id}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (error) {
        console.error('프로필 이미지 업로드 중 오류 발생:', error)
      }
    },
    async sendProfileData() {
      await api.put(`/users/${this.user.id}/profile`, {
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

        this.$router.push('/matching/setup')
      } catch (error) {
        console.error('프로필 저장 중 오류 발생:', error)
      }
    }
  }
}
</script>
