import { createStore } from 'vuex'
import api from '@/api/axios'
import Cookies from 'js-cookie'

export default createStore({
  state: {
    selectedGymId: null,
    user: null,
    accessToken: null
  },
  mutations: {
    setSelectedGymId(state, gymId) {
      state.selectedGymId = gymId
    },
    setUser(state, user) {
      state.user = user
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
    }
  },
  getters: {
    getSelectedGymId: (state) => state.selectedGymId,
    getUser: (state) => state.user,
    getAccessToken: (state) => state.accessToken,
    isAuthenticated: (state) => !!state.accessToken
  }
})
