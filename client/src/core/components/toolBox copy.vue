<template>
  <v-layout row justify-center>
    <v-dialog v-model="isOpen" persistent width="50%">
      <v-card>
        <v-card-title>
          <span class="headline"> {{ translate('toolbox_title') }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-container grid-list-sm>
            <v-layout wrap>
              <v-flex xs6 md3 v-for="(action, index) in actions" :key="index">
                <v-tooltip bottom open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn outlined text v-on="on" @click="handleEvent(action.name)"> <v-icon v-if="action.icon"> {{ action.icon }} </v-icon> <span v-if="!action.icon"> {{ translate(action.name) }} </span></v-btn>
                  </template>
                  <span>{{ translateToolTip(action.name) }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'ToolBox',
  props: {
    screenmodel: Object,
    actions: Array
  },
  data () {
    return {
      isOpen: true
    }
  },
  methods: {
    translate: function (untranslated) {
      let result = '#' + untranslated + '#'
      try {
        result = this.screenmodel.translate(untranslated)
      } catch {}
      return result
    },
    translateToolTip: function (untranslated) {
      let result = ''
      try {
        result = this.screenmodel.translateToolTip(untranslated)
      } catch {}
      return result
    },
    handleEvent: function (actionCommand) {
      window.removeEventListener('keyup', this.handleToolBoxKeyEvent)
      this.isOpen = false
      this.$emit('handleEvent', actionCommand)
    },
    handleToolBoxKeyEvent (event) {
      if (event.keyCode === 27) this.handleEvent('Abort')
    }
  },
  mounted () {
    window.addEventListener('keyup', this.handleToolBoxKeyEvent)
  }
}
</script>
