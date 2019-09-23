import Vue from 'vue'
import Router from 'vue-router'
import logon from '@/modules/logon/views/Logon.vue'
import store from '@/core/stores/store'
import Api from './data-models/api'
import MenuCtrl from '@/modules/menu/menuCtrl'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/logon',
      name: 'logon',
      component: logon
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/modules/menu/views/Menu.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Tool/:toolID',
      component: () => import('@/modules/menu/views/ToolLoader.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      redirect: '/logon'
    }
  ]
})

async function checkautorized (to, from, next) {
  if (Vue.prototype.$api === undefined) Vue.prototype.$api = new Api(router.app.$keycloak)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (router.app.$keycloak.authenticated) {
      let curCtxt = store.getters['ctxtStore/get']
      let curMail = curCtxt.email
      if ((undefined === curMail) || (curMail === '')) {
        let email = router.app.$keycloak.idTokenParsed.email
        await store.dispatch('ctxtStore/read', {
          api: router.app.$api,
          email: email
        })
      }
      if (to.path.startsWith('/Tool')) {
        let regularToolchange = await isToolStartAllowed(to)
        if (regularToolchange) {
          next()
        } else {
          router.push('/menu')
        }
      } else {
        next()
      }
    } else {
      store.dispatch('ctxtStore/delete')
      const loginUrl = router.app.$keycloak.createLoginUrl()
      window.location.replace(loginUrl)
    }
  } else {
    next()
  }
}

async function isToolStartAllowed (to) {
  let ctrl = new MenuCtrl(router.app.$api, router.app.$store)
  let curCtxt = store.getters['ctxtStore/get']
  let toolID = to.params.toolID | 0
  const vpnID = await ctrl.getVpnID()
  const result = await ctrl.isToolStartAllowed(curCtxt, toolID, vpnID)
  return result
}

router.beforeEach(async function (to, from, next) {
  await checkautorized(to, from, next)
})

export default router
