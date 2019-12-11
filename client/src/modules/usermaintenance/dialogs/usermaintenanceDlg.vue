<template>
  <AbstractDialog v-if="ready" @handleKeyEvent="handleKeyEvent" :footerActions="footerActions" :screenmodel="screenModel" :titleextension="dataModel.bokey.id.toString()">
    <template v-slot:content>
      <v-container grid-list-sm>
        <v-layout v-if="isMobile" wrap style="text-align: left">
          <v-flex xs12>
            <v-text-field outlined type="text" placeholder=" " :label="translate('email')" v-model="dataModel.user.email" />
          </v-flex>
          <v-flex xs6>{{dataModel.srcClager}}</v-flex>
          <v-flex xs6>{{dataModel.srcCostDescr}}</v-flex>
          <v-flex xs12><hr/></v-flex>
          <v-flex xs12><b>{{translate('userPwd')}}</b></v-flex>
          <v-flex xs6>{{dataModel.destClager}}</v-flex>
          <v-flex xs6>{{dataModel.destCostDescr}}</v-flex>
          <v-flex xs12><hr/></v-flex>
          <v-flex xs12><b>{{translate('userlang')}}</b></v-flex>
          <v-flex xs6>{{dataModel.dto.ArticleNr.value}}</v-flex>
          <v-flex xs6>{{dataModel.dto.Description.value}}</v-flex>
          <v-flex xs12><hr/></v-flex>
          <v-flex xs12><b>{{translate('admin')}}</b></v-flex>
          <v-flex xs12>{{dataModel.dto.Note.value}}</v-flex>
        </v-layout>
        <v-layout v-else wrap>
          <v-flex xs12 sm4><v-text-field outlined type="text" placeholder=" " :label="translate('userEmail')" v-model="dataModel.user.email" ></v-text-field></v-flex>
          <v-flex xs12 sm8><v-text-field outlined type="password" placeholder=" " :label="translate('userPwd')" v-model="dataModel.user.password" ></v-text-field></v-flex>
          <v-flex xs12 sm4><v-text-field outlined type="text" placeholder=" " :label="translate('userlang')" v-model="dataModel.user.language" ></v-text-field></v-flex>
          <v-flex xs12 sm8><v-checkbox :label="translate('admin')" v-model="dataModel.user.admin" ></v-checkbox></v-flex>
        </v-layout>
      </v-container>
    </template>
  </AbstractDialog>
</template>

<script>
import AbstractDialog from '@/core/components/abstractDialog'
import ScreenmodelService from '@/services/ScreenmodelService'
import usermaintenanceService from '@/modules/Usermaintenance/usermaintenanceService.js'
import KeyCodes from '@/core/data-models/keyCodes'

export default {
  name: 'UsermaintenanceDialog',
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
          name: 'BtnSaveUser',
          event: this.actionSave
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
      if (event.keyCode === KeyCodes.VK_F2) this.actionSave()
      if (event.keyCode === KeyCodes.VK_ESCAPE) this.actionAbort()
    },
    actionHelp () {
      alert('Help not available!')
    },
    async actionSave () {
      try {
        if (this.dataModel.createModus) {
          await usermaintenanceService.create(this.dataModel.user)
        } else {
          await usermaintenanceService.update(this.dataModel.user)
        } 
        this.actionCloseDlg()
      } catch (error) {
        alert('Benutzer konnte nicht gespeichert werden! [ERROR: ' + error + ']')
      }
    },
    async actionAbort () {
      this.$emit('handleEvent', this.callbackActionCommand)
    },
    actionCloseDlg () {
      this.dataModel.changedBokey = this.dataModel.bokey
      this.actionAbort()
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
    const lang = (user.language  === undefined) ? 'de' : user.language
    this.screenModel = await ScreenmodelService.getScreenmodel('vue_UserMaintenanceDlg',user.language)
    this.ready = true
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkMobile)
  }
}
</script>
