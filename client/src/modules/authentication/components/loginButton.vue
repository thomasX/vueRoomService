<template>
   <v-btn text x-small outlined dark @click="logon" v-if="!$keycloak.authenticated">Login</v-btn>
</template>

<script>
import AuthenticationCtrl from '@/core/components/authentication/authenticationCtrl'
export default {
  name: 'LoginButton',
  methods: {
    logon () {
      // this.$router.push('/menu')
      new AuthenticationCtrl(this.$api).login()
    }
  }
}
</script>
