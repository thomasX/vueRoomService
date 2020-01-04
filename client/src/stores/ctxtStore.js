export default {
  namespaced: true,
  strict: true,
  state: {
    user: null,
    tokens: null,
    isUserLoggedIn: false,
    activeAdminUserExists: true
  },
  mutations: {
    set (state, user) {
      state.user = user
    },
    setTokens (state, tokens) {
      state.tokens = tokens
    },
    setActiveAdminUserExists(state, value){
      state.activeAdminUserExists = value
    }
  },
  actions: {
    set ({commit}, user) {
      commit('set', user)
    },
    setTokens ({commit}, tokens) {
      commit('setTokens', tokens)
    },
    setActiveAdminUserExists ({commit}, value) {
      commit('setActiveAdminUserExists', value)
    }
  },
  getters:  {
    get: (state) => state.user,
    getTokens: (state) => state.tokens,
    getActiveAdminUserExists: (state) => state.activeAdminUserExists
  }
}