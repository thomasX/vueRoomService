<template>
   <v-btn light @click="logout" >Logout</v-btn>
</template>

<script>
export default {
  name: 'logoutBtn',
  methods: {
    logout () {
      this.$router.push('/logon')
      this.$keycloak.logoutFn()
    }
  }
}
</script>

<style>

</style>
