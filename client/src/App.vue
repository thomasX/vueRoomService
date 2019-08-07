<template>
  <div id="app">
    <v-app>
      <page-header />
      <main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </main>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/core/components/header.vue'
export default {
  name: 'app',
  components: {
    PageHeader
  },
  data () {
    return {
      //
    }
  }
}
</script>
