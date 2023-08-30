<template>
  <div class="gym-search max-w-xl mx-auto mt-6">
    <div class="search-bar flex">
      <input
        class="search-input flex-grow p-3 border rounded-l focus:border-blue-500 focus:outline-none"
        v-model="query"
        @keyup.enter="searchGyms"
        placeholder="헬스장 검색"
      />
      <button @click="searchGyms" class="px-4 bg-blue-500 text-white rounded-r">검색</button>
    </div>
    <ul class="mt-4">
      <li v-for="gym in gyms" :key="gym.id" class="gym-item mb-4 p-4 bg-white rounded shadow-md relative">
        <h2 class="gym-name text-xl font-bold mb-2 text-center">{{ gym.name }}</h2>
        <p class="gym-address text-sm text-gray-600 text-center">{{ gym.roadAddress }}</p>
        <div class="gym-actions mt-4 text-center">
          <a
            :href="gym.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-gray-500 hover:text-blue-700 hover:underline"
          >
            카카오 지도에서 보기
          </a>
        </div>
        <!-- 추가하기 버튼 -->
        <button
          v-if="!gym.added"
          @click="addToMyGyms(gym)"
          class="absolute top-2 right-2 w-7 h-7 bg-blue-500 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
          title="나의 헬스장으로 등록"
        >
          <i class="fas fa-plus"></i>
        </button>

        <!-- 이미 추가된 상태의 버튼 (빨간색 X 버튼) -->
        <button
          v-else
          class="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-700 text-white rounded-md flex items-center justify-center"
          title="나의 헬스장에서 삭제"
        >
          <i class="fas fa-times"></i>
        </button>
      </li>
    </ul>
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
      query: '',
      gyms: [],
      latitude: null,
      longitude: null
    }
  },
  mounted() {
    this.getUserLocation()
  },
  methods: {
    getUserLocation() {
      // HTML5 Geolocation API 사용
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude
            this.longitude = position.coords.longitude
          },
          (error) => {
            console.error('위치 정보를 가져오는 중 오류 발생:', error)
          }
        )
      } else {
        console.warn('이 브라우저는 Geolocation을 지원하지 않습니다.')
      }
    },
    async searchGyms() {
      if (!this.query.trim()) {
        return
      }

      let params = {
        query: this.query
      }

      if (this.longitude && this.latitude) {
        params.x = this.longitude
        params.y = this.latitude
      }

      try {
        const response = await api.get('/gyms/search', { params })
        this.gyms = response.data.map((gym) => ({
          ...gym,
          added: false
        }))
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error)
      }
    },
    async addToMyGyms(gym) {
      try {
        const response = await api.post(`/users/${this.userId}/gyms`, gym)

        if (response.status === 200) {
          alert('나의 헬스장으로 등록되었습니다.')
          gym.added = true
        } else {
          console.error('헬스장 추가 중 문제가 발생했습니다.')
        }
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error)
      }
    }
  }
}
</script>
