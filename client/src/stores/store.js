import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    activeAdminUsers: true
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser (state, user) {
      state.user = user
    },
    setActiveAdminUserExists(state, value){
      state.activeAdminUsers = value
    }
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    setActiveAdminUserExists ({commit}, value) {
      commit('setActiveAdminUserExists', value)
    }
  },
  getters:  {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getActiveAdminUserExists: (state) => state.activeAdminUsers
  }
})