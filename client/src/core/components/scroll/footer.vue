<template>
  <v-footer ref="footer" :absolute="absolute" :fixed="!absolute" dark color="primary" :height="isMobile ? 50 : 100">
    <v-layout v-if="!isMobile" justify-center>
      <div>
        <span style="padding-left: 1rem" v-for="action in computedActions" :key="action.name">
          <v-tooltip bottom open-delay="500">
            <template v-slot:activator="{ on }">
              <v-btn outlined text v-on="on" @click="action.event"> <v-icon :color="(action.color !== undefined) ? action.color : ''" v-if="action.icon"> {{ action.icon }} </v-icon> <span v-if="!action.icon"> {{ translate(action.name) }} </span></v-btn>
            </template>
            <span>{{ translateToolTip(action.name) }}</span>
          </v-tooltip>
        </span>
      </div>
    </v-layout>
    <v-layout v-if="isMobile" align-center justify-space-around>
      <div>
        <span style="padding-left: 1rem; padding-right: 1rem" v-for="action in mobileActions" :key="action.name">
          <v-tooltip bottom open-delay="500">
            <template v-slot:activator="{ on }">
              <v-btn outlined small text v-on="on" @click="action.event"> <v-icon :color="(action.color !== undefined) ? action.color : ''" v-if="action.icon"> {{ action.icon }} </v-icon> <span v-if="!action.icon"> {{ translate(action.name) }} </span></v-btn>
            </template>
            <span>{{ translateToolTip(action.name) }}</span>
          </v-tooltip>
        </span>
        <v-menu top v-if="mobileExtendedActions.length > 0">
          <template v-slot:activator="{ on }">
            <v-btn style="margin-left: 1rem; padding-right: 1rem" outlined small text v-on="on"><v-icon>more_horiz</v-icon></v-btn>
          </template>
          <v-list dark dense style="background: #1976D2">
            <v-list-item v-for="action in mobileExtendedActions" :key="action.name">
              <span>
                <v-tooltip bottom open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn outlined class="mobileButton" small text v-on="on" @click="action.event"> <v-icon v-if="action.icon" :color="(action.color !== undefined) ? action.color : ''"> {{ action.icon }} </v-icon> <span v-if="!action.icon"> {{ translate(action.name) }} </span></v-btn>
                  </template>
                  <span>{{ translateToolTip(action.name) }}</span>
                </v-tooltip>
              </span>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    absolute: Boolean,
    actions: Array,
    screenmodel: Object
  },
  data () {
    return {
      isMobile: false,
      firstDataReached: false,
      lastDataReached: false,
      reorderedActions: []
    }
  },
  computed: {
    computedActions () {
      this.reorderedActions.forEach(action => {
        if (action.name === 'BtnPageUp') (this.firstDataReached) ? action.color = '#ff0000' : action.color = undefined
        if (action.name === 'BtnStart') (this.firstDataReached) ? action.color = '#ff0000' : action.color = undefined
        if (action.name === 'BtnPageDown') (this.lastDataReached) ? action.color = '#ff0000' : action.color = undefined
        if (action.name === 'BtnEnd') (this.lastDataReached) ? action.color = '#ff0000' : action.color = undefined
      })
      return this.reorderedActions
    },
    mobileActions: function () {
      return this.computedActions.slice(0, 3)
    },
    mobileExtendedActions: function () {
      return this.computedActions.slice(3, this.computedActions.length)
    }
  },
  methods: {
    getHeight () {
      return this.$refs.footer.height
    },
    setFirstDataReached (reached) {
      this.firstDataReached = reached
    },
    setLastDataReached (reached) {
      this.lastDataReached = reached
    },
    checkMobile: function () {
      if (window.innerWidth < 750) this.isMobile = true
      else this.isMobile = false
    },
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
    reorderActions () {
      let reorderedActions = []
      let helpBtn
      this.actions.forEach(action => {
        if (action.name === 'BtnEdit') reorderedActions.unshift(action)
        else if (action.name === 'BtnHelp') helpBtn = action
        else reorderedActions.push(action)
      })
      if (helpBtn !== undefined) reorderedActions.splice(reorderedActions.length, 0, helpBtn)
      return reorderedActions
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkMobile)
  },
  async mounted () {
    this.checkMobile()
    this.reorderedActions = await this.reorderActions()
    window.addEventListener('resize', this.checkMobile)
  }
}
</script>

<style scoped>
.mobileButton {
  max-width: 50px;
  width: 50px
}
.btn {
  padding-left: 5rem
}
</style>
