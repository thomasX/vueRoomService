import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/modules/home/views/Home'
import Login from '@/modules/authentication/views/login'
import Register from '@/modules/authentication/views/register'
import Reservations from '@/modules/reservations/views/reservations'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/modules/about/views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: Reservations
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import(/* webpackChunkName: "about" */ '@/modules/menu/views/Menu.vue')
    },
  ]
})
