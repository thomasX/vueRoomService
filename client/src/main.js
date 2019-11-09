import Vue from 'vue'
import App from '@/App.vue'
import router from '@/core/router'
import store from '@/stores/store'
import { sync } from 'vuex-router-sync'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import Vue2TouchEvents from 'vue2-touch-events'
import Panel from '@/core/components/panel'

Vue.config.productionTip = false
Vue.use(Vue2TouchEvents)

Vue.component('panel',Panel)
sync(store,router)

new Vue({
  vuetify,
  router,
  store,
  el: "#app",
  components: { App },
  render: h => h(App)
}).$mount('#app')
