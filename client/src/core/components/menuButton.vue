<template>
   <v-btn text x-small outlined dark v-if="((this.$route.path !== '/menu') && (this.$keycloak.authenticated))" @click="goToMenu">Menu</v-btn>
</template>

<script>
export default {
  name: 'MenuButton',
  methods: {
    goToMenu () {
      this.$router.push('/menu')
    }
  }
}
</script>
