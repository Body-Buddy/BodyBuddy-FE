<template>
  <div class="spinner-container">
    <div class="spinner">
      <img src="/spinner.gif" alt="Loading..." />
    </div>
  </div>
</template>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner img {
  width: 50px;
}
</style>

<script>
import Cookies from 'js-cookie'

export default {
  async mounted() {
    const accessToken = Cookies.get('accessToken')
    this.$store.commit('setAccessToken', accessToken)
    Cookies.remove('accessToken')

    await this.$store.dispatch('fetchUser')

    const user = this.$store.getters.getUser
    
    if (user.needSocialSignup) {
      this.$router.push('/signup/social')
    } else if (!user.hasRegisteredGym) {
      this.$router.push('/gyms/setup')
    } else if (!user.hasSetProfile) {
      this.$router.push('/profile/setup')
    } else if (!user.hasSetMatchingCriteria) {
      this.$router.push('/matching/setup')
    } else {
      this.$router.push('/friends')
    }
  }
}
</script>
