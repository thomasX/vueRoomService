import Vue from 'vue'
import './plugins/vuetify'
import App from '@/App.vue'
import router from '@/core/router'
import store from '@/stores/store'
import { sync } from 'vuex-router-sync'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

sync(store,router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
