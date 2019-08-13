import Vue from 'vue'
import App from '@/App.vue'
import router from '@/core/router'
import store from '@/stores/store'
import { sync } from 'vuex-router-sync'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import Panel from '@/core/components/panel'

Vue.config.productionTip = false
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
