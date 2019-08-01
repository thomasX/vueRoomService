import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './core/router'
import store from '@/stores/store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
