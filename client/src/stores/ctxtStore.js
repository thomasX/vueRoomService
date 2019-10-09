export default {
  namespaced: true,
  strict: true,
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    activeAdminUserExists: true
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    set (state, user) {
      state.user = user
    },
    setActiveAdminUserExists(state, value){
      state.activeAdminUserExists = value
    }
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    set ({commit}, user) {
      commit('set', user)
    },
    setActiveAdminUserExists ({commit}, value) {
      commit('setActiveAdminUserExists', value)
    }
  },
  getters:  {
    get: (state) => state.user,
    getToken: (state) => state.token,
    getActiveAdminUserExists: (state) => state.activeAdminUserExists
  }
}