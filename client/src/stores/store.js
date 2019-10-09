import Vue from 'vue'
import Vuex from 'vuex'
import ctxtStore from './ctxtStore.js'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState({
      paths: ['ctxtStore'],
    })
  ],
  modules: {
    ctxtStore
  }
})
