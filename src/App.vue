<template>
  <v-app>
    <p>
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
    <router-link to="/about">Go to About</router-link>
    ...
    <router-link to="/">Go to Home</router-link>
  </p>
   <router-view></router-view>
    <Helloworld/>
  </v-app>
</template>

<script>
import Home from '@/modules/home/views/Home'

export default {
  name: 'App',
  components: {
    Home
  },
  data () {
    return {
      //
    }
  }
}
</script>
