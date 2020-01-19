<template>
  <AbstractDialog v-if="ready" @handleKeyEvent="handleKeyEvent" :footerActions="footerActions" :screenmodel="screenModel" :titleextension="dataModel.bokey.id.toString()">
    <template v-slot:content>
      <v-container grid-list-sm>
        <v-layout v-if="isMobile" wrap style="text-align: left">
          <v-flex xs12>
            <v-text-field outlined type="text" placeholder=" " :label="translate('email')" v-model="dataModel.email" />
          </v-flex>
          <v-flex xs12>
            <v-text-field outlined type="password" placeholder=" " :label="translate('userPwd')" v-model="dataModel.password" />
          </v-flex>
        </v-layout>
        <v-layout v-else wrap>
          <v-flex xs12 sm4><v-text-field outlined type="text" placeholder=" " :label="translate('userEmail')" v-model="dataModel.email" ></v-text-field></v-flex>
          <v-flex xs12 sm8><v-text-field outlined type="password" placeholder=" " :label="translate('userPwd')" v-model="dataModel.password" ></v-text-field></v-flex>
        </v-layout>
      </v-container>
    </template>
  </AbstractDialog>
</template>

<script>
import AbstractDialog from '@/core/components/abstractDialog'
import ScreenmodelService from '@/services/ScreenmodelService'
import AuthenticationService from '@/services/AuthenticationService'
import KeyCodes from '@/core/data-models/keyCodes'

export default {
  name: 'LoginDialog',
  components: {
    AbstractDialog
  },
  props: {
    dataModel: {
      type: Object,
      required: true
    },
    callbackActionCommand: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isMobile: false,
      ready: false,
      mandCtxt: {},
      screenModel: {},
      footerActions: [
        {
          name: 'BtnLogin',
          event: this.actionLogin
        },
        {
          name: 'BtnEscape',
          event: this.actionAbort
        }
        // {
        //   name: 'BtnEscape',
        //   event: this.actionAbort,
        //   icon: 'clear'
        // }
      ]
    }
  },
  methods: {
    handleKeyEvent (event) {
      if (event.keyCode === KeyCodes.VK_F2) this.actionLogin()
      if (event.keyCode === KeyCodes.VK_ESCAPE) this.actionAbort()
    },
    actionHelp () {
      alert('Help not available!')
    },
    async actionLogin () {
      console.log('####### bin im login')
      try {
        const response = await AuthenticationService.login({
          email: this.dataModel.email,
          password: this.dataModel.password
        })
        const userCtxt = response.data.user
        const tokens = { accessToken: userCtxt.accessToken, refreshToken: userCtxt.refreshToken }
        delete userCtxt.accessToken
        delete userCtxt.refreshToken
        this.$store.dispatch('ctxtStore/setTokens', tokens)
        this.$store.dispatch('ctxtStore/set', response.data.user)
        this.$router.push({
          name: 'reservations'
        })
      } catch (error) {
        this.$util.interactionDialog.popup(this.screenModel.translate('ErrorDlgTitle'), this.screenModel.translate('login failed') + error , 2500)
      }
    },
    async actionAbort () {
      this.$router.push({
        name: 'home'
      })
    },
    actionCloseDlg () {
    },
    translate: function (untranslated) {
      let result = untranslated
      if (this.screenModel !== {}) {
        result = this.screenModel.translate(untranslated)
      }
      return (result)
    },
    checkMobile: function () {
      if (window.innerWidth < 750) this.isMobile = true
      else this.isMobile = false
    }
  },
  async beforeMount () {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    // this.userService = new TransportCtrl(this.$api)
    const user = this.$store.getters['ctxtStore/get']
    const lang = (!user) || (user.language  === undefined) ? 'de' : user.language
    this.screenModel = await ScreenmodelService.getScreenmodel('vue_UserMaintenanceDlg',lang)
    this.ready = true
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkMobile)
  }
}
</script>
