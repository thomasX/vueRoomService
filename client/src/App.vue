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
import InterActionDialog from '@/core/components/interactionDialog.vue'

const { detect } = require('detect-browser')
const browser = detect()

export default {
  name: 'app',
  components: {
    Header,
    InterActionDialog
  },
  data () {
    return {
      //
    }
  },
  mounted () {
    this.$util.interactionDialog = this.$refs.interactionDialog
    this.$util.browser = browser
  }
}
</script>
