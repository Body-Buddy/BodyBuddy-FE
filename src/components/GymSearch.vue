<template>
  <div class="max-w-xl mx-auto mt-10">
    <div class="mb-4">
      <p class="text-blue-500 text-3xl tracking-wide font-extrabold mb-2">1/3</p>
      <p class="font-bold text-2xl mb-2">주로 어디서 운동하세요?</p>
      <p class="text-gray-600">헬스장, 요가원, 클라이밍짐 어디든 좋아요.</p>
    </div>
    <div class="search-bar flex">
      <input
        class="search-input flex-grow p-3 border rounded-l focus:border-blue-500 focus:outline-none"
        v-model="query"
        @keyup.enter="searchGyms"
        placeholder="운동 장소나 주소명을 입력하세요."
      />
      <button @click="searchGyms" class="px-4 bg-blue-500 text-white rounded-r">검색</button>
    </div>

    <div
      @click="toggleSearchResults"
      class="cursor-pointer bg-gray-300 text-gray-500 text-center py-1"
    >
      <span v-if="!showSearchResults">검색 결과 보기</span>
      <span v-else>검색 결과 숨기기</span>
      <i class="fas fa-chevron-up ml-2"></i>
    </div>

    <ul v-if="showSearchResults" class="mt-4">
      <li v-if="noResults" class="text-center p-4 bg-red-200 rounded shadow-md">
        검색 결과가 없습니다.
      </li>
      <li
        v-for="gym in gyms"
        :key="gym.id"
        class="gym-item mb-4 p-4 bg-white rounded shadow-md relative"
      >
        <h2 class="gym-name font-semibold mb-2 text-center">{{ gym.name }}</h2>
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
          @click="addToMyGyms(gym)"
          class="absolute top-2 right-2 w-7 h-7 bg-blue-500 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
          title="나의 헬스장으로 등록"
        >
          <i class="fas fa-plus"></i>
        </button>
      </li>
    </ul>
  </div>

  <!-- 나의 헬스장 목록 -->
  <div v-if="myGyms.length" class="max-w-xl mx-auto mt-6 text-center">
    <h2 class="font-bold text-xl mb-2">나의 헬스장 목록</h2>
    <ul>
      <li
        v-for="myGym in myGyms"
        :key="myGym.id"
        class="gym-item mb-4 p-4 bg-white rounded shadow-md relative"
      >
        <h2 class="gym-name font-semibold mb-2">{{ myGym.name }}</h2>
        <p class="gym-address text-sm text-gray-600">{{ myGym.roadAddress }}</p>

        <button
          @click="removeFromMyGyms(myGym)"
          class="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-700 text-white rounded-md flex items-center justify-center"
          title="나의 헬스장에서 삭제"
        >
          <i class="fas fa-times"></i>
        </button>
      </li>
    </ul>
    <button
      @click="submitMyGyms"
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-600"
    >
      다음으로
    </button>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  data() {
    return {
      user: this.$store.getters.getUser,
      latitude: null,
      longitude: null,
      query: '', 
      gyms: [],
      myGyms: [],
      showSearchResults: true,
      noResults: false
    }
  },
  async mounted() {
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
    toggleSearchResults() {
      this.showSearchResults = !this.showSearchResults
    },
    async searchGyms() {
      if (!this.query.trim()) {
        return
      }

      this.showSearchResults = true

      let params = {
        query: this.query
      }

      if (this.longitude && this.latitude) {
        params.x = this.longitude
        params.y = this.latitude
      }

      const response = await api.get('/gyms/search', { params })
      if (response.data && response.data.length > 0) {
        this.gyms = response.data
        this.noResults = false
      } else {
        this.gyms = []
        this.noResults = true
      }
    },

    addToMyGyms(gym) {
      this.gyms = this.gyms.filter((g) => g.id !== gym.id)
      this.myGyms.push(gym)
    },

    removeFromMyGyms(gym) {
      this.myGyms = this.myGyms.filter((g) => g.id !== gym.id)
    },

    async submitMyGyms() {
      if (this.myGyms.length === 0 || this.myGyms.length > 5) {
        alert('헬스장은 1개 이상 5개 이하로 선택 가능합니다.')
        return
      }

      for (let gym of this.myGyms) {
        await api.post(`/users/${this.user.id}/gyms`, gym)
      }

      this.$router.push('/profile/setup')
    }
  }
}
</script>
