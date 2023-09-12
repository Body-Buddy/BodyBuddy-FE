<template>
  <div
    class="main-page h-screen bg-center bg-cover"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div
      class="h-full bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center"
    >
      <h1 class="text-4xl font-semibold mb-4">바디버디에 오신걸 환영해요 🙌🏻</h1>
      <p class="text-2xl mb-8">내가 다니는 헬스장에서 함께 운동할 친구를 찾아보세요!</p>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        @click="gotoFriendSearch"
      >
        친구 찾으러 가기
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgImage: null
    }
  },
  mounted() {
    this.bgImage = '/background.jpg'
  },
  methods: {
    gotoFriendSearch() {
      const accessToken = this.$store.getters.getAccessToken

      if(accessToken) {
        this.$router.push('/friends')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>
