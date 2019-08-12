<template>
  <v-layout column>
    <v-flex xs6 offset-xs3>
      <panel title="Register">
        <form 
          name="tab-tracker-form"
          autocomplete="off">
          <v-text-field
            label="Email"
            v-model="email"
          ></v-text-field>
          <br>
          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            autocomplete="new-password"
          ></v-text-field>
          <br>
          <v-checkbox
            label="Admin"
            v-model="admin"
          ></v-checkbox>
        </form>
        <br>
        <div class="danger-alert" v-html="error" />
        <br>
        <div class="success" v-html="success" />
        <br>
        <v-btn
          dark
          class="cyan"
          @click="register">
          Register
        </v-btn>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      email: '',
      password: '',
      admin: false,
      error: null,
      success: null
    }
  },
  methods: {
    async register () {
      try {
        // const response = await AuthenticationService.register(
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password,
          admin: this.admin
        })
        // this.$store.dispatch('setToken', response.data.token)
        // this.$store.dispatch('setUser', response.data.user)
        this.error = null
        this.success = JSON.stringify(response.data.user.email) + ' successfully registered ' 
        this.email = '',
        this.password = '',
        this.admin = false,
        this.$router.push({
          name: 'register'
        })
      } catch (error) {
        this.success = null
        this.error = (error.response) ? error.response.data.error : 'no response from API-Server'
      }
    }
  }
}
</script>

<style scoped>
.danger-alert{
  color: crimson
}
.success{
  color: darkgreen
}
</style>