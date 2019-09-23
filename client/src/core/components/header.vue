<template>
  <div>
    <v-app-bar ref="header" app fixed dark color="primary" v-if="!isMobile" height="75">
      <v-toolbar-title class="white--text" v-if="!this.$api.keycloak.authenticated">{{ translate('title') }} </v-toolbar-title>
      <v-toolbar-title class="white--text" v-if="this.$keycloak.authenticated"> {{ translate('title') }} | {{ mandCtxt.userName }} | {{ mandCtxt.curToolID }} | {{ this.$api.version }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <MenuButton />
        <LogoutButton />
        <LoginButton />
      </v-toolbar-items>
    </v-app-bar>
    <v-app-bar ref="header" app fixed dark color="primary" v-if="isMobile" height="50">
      <v-toolbar-title class="white--text" v-if="!this.$api.keycloak.authenticated">{{ translate('title') }} </v-toolbar-title>
      <v-toolbar-title class="white--text" v-if="this.$keycloak.authenticated">{{ translate('title') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <MenuButton />
        <LogoutButton />
        <LoginButton />
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import LogoutButton from '@/core/components/authentication/logoutButton'
import LoginButton from '@/core/components/authentication/loginButton'
import MenuButton from '@/core/components/menuButton'
import Screenmodel from '@/core/data-models/screenmodel'

export default {
  name: 'Header',
  data: function () {
    return {
      screenmodel: {},
      isMobile: false
    }
  },
  components: {
    LogoutButton,
    LoginButton,
    MenuButton
  },
  computed: {
    mandCtxt: function () { return this.$store.getters['ctxtStore/get'] }
  },
  methods: {
    checkMobile: function () {
      if (window.innerWidth < 750) this.isMobile = true
      else this.isMobile = false
    },
    translate: function (untranslated) {
      let result = 'kein screenmodel !'
      try {
        if (this.screenmodel !== undefined) {
          result = this.screenmodel.translate(untranslated)
        }
      } catch {
        result = '#' + untranslated + '#'
      }
      return result
    },
    getHeight () {
      return this.$refs.header.height
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkMobile)
  },
  async mounted () {
    this.checkMobile()
    let mandCtxt = this.$store.getters['ctxtStore/get']
    this.screenmodel = await new Screenmodel().init(mandCtxt.mandantenID, mandCtxt.email, 'vue_ferps', this.$api)
    window.addEventListener('resize', this.checkMobile)
  }
}
</script>
