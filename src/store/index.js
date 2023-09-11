import { createStore } from 'vuex'
import api from '@/api/axios'

export default createStore({
  state: {
    selectedGymId: null,
    userId: null,
    nickname: null
  },
  mutations: {
    setSelectedGymId(state, gymId) {
      state.selectedGymId = gymId;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setNickname(state, nickname) {
      state.nickname = nickname;
    }
  },
  actions: {
    updateSelectedGymId({ commit }, gymId) {
      commit('setSelectedGymId', gymId);
    },
    updateUserId({ commit }, userId) {
      commit('setUserId', userId);
    },
    updateNickname({ commit }, nickname) {
      commit('setNickname', nickname);
    },
    async updateUserInfo({ commit }) {
      const response = await api.get('/auth/user')
      commit('setUserId', response.data.id)
      commit('setNickname', response.data.nickname)
    }
  },
  getters: {
    getSelectedGymId: state => state.selectedGymId,
    getUserId: state => state.userId,
    getNickname: state => state.nickname
  }
})
