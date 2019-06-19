import Vue from 'vue'
import Vuex from 'vuex'
import ctxtStore from './core/ctxtStore.js'
import roomsStore from '@/modules/rooms/roomsStore'
import reservationsStore from '@/modules/reservations/reservationsStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ctxtStore,
    roomsStore,
    reservationsStore
  }
})

