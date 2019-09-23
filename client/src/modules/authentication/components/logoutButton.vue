<template>
   <v-btn text x-small outlined dark @click="logout" v-if="$keycloak.authenticated">Logout</v-btn>
</template>

<script>
import AuthenticationCtrl from '@/core/components/authentication/authenticationCtrl'
export default {
  name: 'LogoutButton',
  methods: {
    async logout () {
      const ctrl = new AuthenticationCtrl(this.$api)
      await ctrl.logout()
    }
  }
}
</script>
