<template>
  <div id="app">
    <v-app id="inspire">
      <Header ref="appHeader"/>
      <main>
        <v-content>
          <router-view/>
        </v-content>
      </main>
      <InterActionDialog ref="interactionDialog"/>
    </v-app>
  </div>
</template>

<script>
import Header from '@/core/components/pageheader.vue'
export default {
  name: 'app',
  components: {
    Header
  },
  data () {
    return {
      //
    }
  }
}
</script>
