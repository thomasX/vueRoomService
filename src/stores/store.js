import Vue from 'vue'
import Vuex from 'vuex'
import ctxtStore from './ctxtStore.js'
import menuStore from './menuStore'
import roomsStore from './ctxtStore'
import reservationsStore from './reservationStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ctxtStore,
    menuStore,
    roomsStore,
    reservationsStore
  }
})

