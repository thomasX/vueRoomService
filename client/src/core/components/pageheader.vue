<template>
  <v-app-bar app name="appbar" fixed class="cyan" dark>
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
        text 
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
        text 
        dark
        :to="{
          name: 'login'
        }">
        Login
      </v-btn>
      <v-btn 
        v-if="registerAllowed"
        text 
        dark
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn>
      <v-btn 
        v-if="$store.state.isUserLoggedIn"
        text 
        dark
        @click="logout">
        Log Out
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  computed: {
    registerAllowed: function () {
      const curUserAllowed = (this.$store.state.isUserLoggedIn && this.$store.state.user.admin)
      const noAdminUserExists= (! this.$store.state.activeAdminUsers)
      return (curUserAllowed || noAdminUserExists) 
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
    },
    async checkActiveAdminUsers () {
      const response = await AuthenticationService.activeAdminUserExists()
      this.$store.dispatch('setActiveAdminUserExists',response.data)
    }
  },
  async beforeMount () {
    await this.checkActiveAdminUsers();
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
