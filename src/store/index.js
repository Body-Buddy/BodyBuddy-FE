import { createStore } from 'vuex'
import api from '@/api/axios'
import Cookies from 'js-cookie'

export default createStore({
  state: {
    selectedGymId: null,
    user: null,
    gyms: [],
    accessToken: null
  },
  mutations: {
    setSelectedGymId(state, gymId) {
      state.selectedGymId = gymId
    },
    setUser(state, user) {
      state.user = user
    },
    setGyms(state, gyms) {
      state.gyms = gyms
    },
    setAccessToken(state, token) {
      state.accessToken = token
    },
    logout(state) {
      state.user = null
      state.accessToken = null
      Cookies.remove('refreshToken')
    }
  },
  actions: {
    updateSelectedGymId({ commit }, gymId) {
      commit('setSelectedGymId', gymId)
    },
    async fetchUser({ commit }) {
      const response = await api.get('/auth/user');
      commit('setUser', response.data);
    },
    async fetchUserGyms({ commit, state }) {
      const response = await api.get(`/users/${state.user.id}/gyms`)

      if (state.selectedGymId === null && response.data.length > 0) {
        commit('setSelectedGymId', response.data[0].id)
      }
      
      commit('setGyms', response.data)
    },
  },
  getters: {
    getSelectedGymId: (state) => state.selectedGymId,
    getUser: (state) => state.user,
    getGyms: (state) => state.gyms,
    getAccessToken: (state) => state.accessToken,
    isAuthenticated: (state) => !!state.accessToken
  }
})
