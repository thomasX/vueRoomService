<template>
  <v-layout v-on:keyup="handleKeyEvent">
    <v-dialog v-model="dialog" persistent scrollable>
      <v-card>
        <v-toolbar flat dense class="primary" dark>
          <v-toolbar-title>{{translate('dlg_title')}}</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-title>{{titleextension}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <slot name="content">No Content provided!</slot>
        </v-card-text>
        <v-card-actions style="height: 50px">
          <Footer :actions="footerActions" :screenmodel="screenmodel" :absolute="true"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Footer from '@/core/components/footer'

export default {
  name: 'AbstractDialog',
  components: {
    Footer
  },
  props: {
    footerActions: Array,
    screenmodel: Object,
    titleextension: String
  },
  data () {
    return {
      dialog: true
    }
  },
  methods: {
    handleKeyEvent (event) {
      this.$emit('handleKeyEvent', event)
    },
    translate (untranslated) {
      let result = untranslated
      if (this.screenmodel !== {}) {
        result = this.screenmodel.translate(untranslated)
      }
      return (result)
    }
  }
}
</script>
