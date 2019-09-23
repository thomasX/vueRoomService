<template>
  <div id="app">
    <v-app>
      <pageheader ref="appHeader"/>
      <main>
        <v-content>
          <v-container fluid>
            <router-view></router-view>
          </v-container>
        </v-content>
      </main>
    </v-app>
  </div>
</template>

<script>
import pageheader from '@/core/components/pageheader.vue'
export default {
  name: 'app',
  components: {
    pageheader
  },
  data () {
    return {
      //
    }
  }
}
</script>
