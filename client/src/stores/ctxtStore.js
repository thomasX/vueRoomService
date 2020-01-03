export default {
  namespaced: true,
  strict: true,
  state: {
    user: null,
    isUserLoggedIn: false,
    activeAdminUserExists: true
  },
  mutations: {
    set (state, user) {
      state.user = user
    },
    setActiveAdminUserExists(state, value){
      state.activeAdminUserExists = value
    }
  },
  actions: {
    set ({commit}, user) {
      commit('set', user)
    },
    setActiveAdminUserExists ({commit}, value) {
      commit('setActiveAdminUserExists', value)
    }
  },
  getters:  {
    get: (state) => state.user,
    getActiveAdminUserExists: (state) => state.activeAdminUserExists
  }
}