<template>
  <v-layout v-on:keyup="handleEvent">
    <v-dialog v-model="dialog" persistent :max-width="options.width" :transition="false">
      <v-card>
        <v-toolbar dark :color="color" dense flat>
          <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        </v-toolbar>
        <v-progress-linear v-if="loadingDialog" indeterminate/>
        <v-card-text v-show="!!message"><div style="font-weight: bold">{{ message }}</div></v-card-text>
        <v-card-actions :style="getCardActionStyle()" v-if="actions.length > 0">
          <Footer :actions="actions" :absolute="true" :screenmodel="options.screenmodel"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Footer from '@/core/components/footer'

export default {
  name: 'InterActionDialog',
  components: {
    Footer
  },
  data: () => ({
    isMobile: false,
    dialog: false,
    loadingDialog: false,
    message: null,
    title: null,
    actions: [],
    options: {
      width: 300
    },
    color: null,
    resolve: null,
    reject: null
  }),
  methods: {
    /*
     * @param title: String -> represents the translated string of the dialog-title
     * @param message: String -> represents the translated message
     * @param options: Object -> an Object with various options -> supported options: width (defines the width of the dialog), screenmodel (defines the screenmodel for footer-translation)
     */
    async checkYesNoDialog (title, message, options) {
      const actions = [
        {
          name: 'BtnAgree',
          icon: 'done'
        },
        {
          name: 'BtnCancle',
          icon: 'close'
        }
      ]
      await this.setValues(title, message, actions, 'primary', options)
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    /*
     * @param title: String -> represents the translated string of the dialog-title
     * @param message: String -> represents the translated message
     * @param actions: Array -> represents the buttons, which are displayed in the card-actions (format: { name: <btn_name>, icon: <icon_name>})
     * @param options: Object -> an Object with various options -> supported options: width (defines the width of the dialog), screenmodel (defines the screenmodel for footer-translation)
     */
    async openDialog (title, message, actions, options) {
      await this.setValues(title, message, actions, 'primary', options)
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    /*
     * @param title: String -> represents the translated string of the dialog-title
     * @param message: String -> represents the translated message
     * @param options: Object -> an Object with various options -> supported options: width (defines the width of the dialog), screenmodel (defines the screenmodel for footer-translation)
     */
    async openLoadingDialog (title, message, options) {
      await this.setValues(title, message, [], 'green', options)
      this.loadingDialog = true
      this.dialog = true
    },
    closeLoadingDialog () {
      this.dialog = false
    },
    /*
     * @param title: String -> represents the translated string of the dialog-title
     * @param errorMessage: String -> represents the errorMessage
     * @param options: Object -> an Object with various options -> supported options: width (defines the width of the dialog), screenmodel (defines the screenmodel for footer-translation)
     */
    async openErrorDialog (title, errorMessage, timeout, options) {
      await this.setValues(title, errorMessage, [], 'red', options)
      this.dialog = true
      let self = this
      setTimeout(function () { self.handleEvent('BtnCancle') }, timeout)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    /*
     * @param title: String -> represents the translated string of the popup-title
     * @param message: String -> represents the translated message
     * @param timeout: Integer -> defines how long the popup is visible (in milliseconds)
     * @param options: Object -> an Object with various options -> supported options: width (defines the width of the dialog), screenmodel (defines the screenmodel for footer-translation)
     */
    async popup (title, message, timeout, options) {
      await this.setValues(title, message, [], 'primary', options)
      this.dialog = true
      let self = this
      setTimeout(function () { self.handleEvent('BtnCancle') }, timeout)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    async setValues (title, message, actions, color, options) {
      await this.restoreValues()
      let self = this
      this.title = title
      this.message = message
      actions.forEach((action) => {
        action.event = function () { self.handleEvent(action.name) }
      })
      this.actions = actions
      this.color = color
      this.options = Object.assign(this.options, options)
    },
    handleEvent (name) {
      let used = false
      if (name === 'BtnAgree') { this.agree(); used = true }
      if (!used && name === 'BtnCancle') { this.cancel(); used = true }
      if (!used) this.handleBtnEvent(name)
      this.restoreValues()
    },
    agree () {
      this.resolve(true)
      this.dialog = false
    },
    cancel () {
      this.resolve(false)
      this.dialog = false
    },
    handleBtnEvent (name) {
      this.resolve(name)
      this.dialog = false
    },
    restoreValues () {
      this.dialog = false
      this.loadingDialog = false
      this.message = null
      this.title = null
      this.actions = []
      this.options = {
        width: 300
      }
      this.color = null
      this.resolve = null
      this.reject = null
    },
    getCardActionStyle () {
      return 'height: ' + ((this.isMobile) ? '50px' : '100px')
    },
    checkMobile () {
      if (window.innerWidth < 750) this.isMobile = true
      else this.isMobile = false
    }
  },
  beforeMount () {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkMobile)
  }
}
</script>
