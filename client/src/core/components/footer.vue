<template>
  <v-footer :absolute="absolute" :fixed="!absolute" dark color="primary" height="100">
    <v-layout v-if="!isMobile" align-center justify-space-around>
      <div>
        <span v-for="action in actions" :key="action.name">
          <v-tooltip bottom open-delay="500">
            <template v-slot:activator="{ on }">
              <v-btn small text v-on="on" @click="action.event"> <v-icon v-if="action.icon"> {{ action.icon }} </v-icon> <span v-if="!action.icon"> {{ translate(action.name) }} </span></v-btn>
            </template>
            <span>{{ translateToolTip(action.name) }}</span>
          </v-tooltip>
        </span>
      </div>
    </v-layout>
    <v-layout v-if="isMobile" align-center justify-space-around>
      <div>
        <span v-for="action in mobileActions" :key="action.name">
          <v-tooltip bottom open-delay="500">
            <template v-slot:activator="{ on }">
              <v-btn small text v-on="on" @click="action.event"> <v-icon v-if="action.icon"> {{ action.icon }} </v-icon> <span v-if="!action.icon"> {{ translate(action.name) }} </span></v-btn>
            </template>
            <span>{{ translateToolTip(action.name) }}</span>
          </v-tooltip>
        </span>
        <v-menu top v-if="mobileExtendedActions.length > 0">
          <template v-slot:activator="{ on }">
            <v-btn small text v-on="on"><v-icon>menu</v-icon></v-btn>
          </template>
          <v-list dark dense style="background: #1976D2">
            <v-list-item v-for="action in mobileExtendedActions" :key="action.name">
              <span>
                <v-tooltip bottom open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn class="mobileButton" small text v-on="on" @click="action.event"> <v-icon v-if="action.icon"> {{ action.icon }} </v-icon> <span v-if="!action.icon"> {{ translate(action.name) }} </span></v-btn>
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
      isMobile: false
    }
  },
  computed: {
    mobileActions: function () {
      return this.actions.slice(0, 5)
    },
    mobileExtendedActions: function () {
      return this.actions.slice(5, this.actions.length)
    }
  },
  methods: {
    checkMobile: function () {
      if (window.innerWidth < 750) this.isMobile = true
      else this.isMobile = false
    },
    translate: function (untranslated) {
      let result = '#' + untranslated + '#'
      try {
        result = this.screenmodel.translate(untranslated)
      } catch {
        // nothing todo
      }
      return result
    },
    translateToolTip: function (untranslated) {
      let result = ''
      try {
        result = this.screenmodel.translateToolTip(untranslated)
      } catch {
        // nothing todo
      }
      return result
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkMobile)
  },
  mounted () {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  }
}
</script>

<style scoped>
.mobileButton {
  max-width: 50px;
  width: 50px;
}
</style>
