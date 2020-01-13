<template>
  <v-app-bar ref="header" app name="appbar" color="primary"  dark>
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
      <v-btn text dark :to="{name: 'reservations'}">Reservations</v-btn>
      <v-btn text dark :to="{name: 'Usermaintenance'}">Usermaintenance</v-btn>
    </v-toolbar-items>
      <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn 
        v-if="!$store.getters['ctxtStore/get']"
        text 
        dark
        :to="{
          name: 'login'
        }">
        Login
      </v-btn>
      <v-btn 
        v-if="((!$store.getters['ctxtStore/get']) && (!$store.getters['ctxtStore/getActiveAdminUserExists']))"
        text 
        dark
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn>
      <v-btn 
        v-if="$store.getters['ctxtStore/get']"
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
    tokens: function () {
      const result = this.$store.getters['ctxtStore/getTokens']
      return result
    }
  },
  watch: {
    tokens (newTokens, oldTokens) {
      let shouldLogout 
      if (oldTokens !== newTokens) {
        if (!newTokens) shouldLogout = true
        if ((newTokens) && (!newTokens.accessToken)) shouldLogout = true
      }
      if (shouldLogout) this.logout()
    }
  },
  methods: {
    registerAllowed: function () {
      const curUserAllowed = (this.$store.state.isUserLoggedIn && this.$store.state.user.admin)
      const noAdminUserExists= (! this.$store.state.activeAdminUsers)
      const result = (curUserAllowed || noAdminUserExists)
      return result
    },  
    logout () {
      this.$store.dispatch('ctxtStore/set', null)
      this.$store.dispatch('ctxtStore/setTokens', null)
      this.$router.push({
        name: 'home'
      })
    },
    async checkActiveAdminUsers () {
      const response = await AuthenticationService.activeAdminUserExists()
      this.$store.dispatch('ctxtStore/setActiveAdminUserExists',response.data)
    },
    getHeight () {
      return this.$refs.header.height
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
