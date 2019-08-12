<template>
  <v-toolbar app name="appbar" fixed class="cyan" dark>
    <v-toolbar-title class="mr-4">
      <router-link 
        class="home"
        tag="span"
        :to="{
          name: 'reservations'
        }">
        Reservation-System
      </router-link>
    </v-toolbar-title>
    <v-toolbar-items>
      <v-btn 
        flat 
        dark
        :to="{
          name: 'reservations'
        }">
        Reservations
      </v-btn>
    </v-toolbar-items>
      <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn 
        v-if="!$store.state.isUserLoggedIn"
        flat 
        dark
        :to="{
          name: 'login'
        }">
        Login
      </v-btn>
      <v-btn 
        v-if="(($store.state.isUserLoggedIn && $store.state.user.admin) || ($store.state.noActiveUsers)) "
        flat 
        dark
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn>
      <v-btn 
        v-if="$store.state.isUserLoggedIn"
        flat 
        dark
        @click="logout">
        Log Out
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
    },
    checkActiveUsers () {
      const noUsers = AuthenticationService.noActiveUsers()
      this.$store.dispatch('setNoActiveUsers',noUsers)
    }
  },
  async beforeMount () {
    this.checkActiveUsers();
  }
}
</script>

<style scoped>
.home {
  cursor: pointer;
}
.home:hover {
  color: #E9E;
}
</style>
