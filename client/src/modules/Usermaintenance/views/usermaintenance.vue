<template>
  <div>
    <v-progress-circular v-if="!ready" indeterminate color="primary" />
    <UserMaintenanceDialog v-if="(ready && editDialogOpened)" @handleEvent="handleEvent" :screenmodel="screenmodel" :dataModel="dlgDataModel" :callbackActionCommand="callbackUsermaintenanceDlg"/>
    <DataScroll ref="scroll" v-if="ready" :lastrefreshRequest="lastrefreshRequest" :screenmodel="screenmodel" :scrolldefinition="scrolldefinition" :extendedscrollactions="extendedscrollactions" @handleEvent="handleEvent" :lineFactor="lineFactor"/>
  </div>
</template>

<script>
import DataScroll from '@/core/components/scroll/datascroll'
import ScreenmodelService from '@/services/ScreenmodelService'
import UserMaintenanceDialog from '@/modules/Usermaintenance/dialogs/usermaintenanceDlg.vue'
import usermaintenanceService from '@/modules/Usermaintenance/usermaintenanceService'

export default {
  name: 'UserScroll_Main',
  components: {
    DataScroll,
    UserMaintenanceDialog
  },
  data () {
    return {
      ready: false,
      lastrefreshRequest: { lastrefresh: new Date().toISOString() },
      callbackUsermaintenanceDlg: 'actionCloseDialog',
      editDialogOpened: false,
      dataModel: {},
      lineFactor: 10,
      scrolldefinition: {
        scrollBO: 'UserScrollBO',
        scrollID: 'vue_Userscroll_Main',
        curSort: 'email',
        // appfilter: "((GRP like '%|G43|%') AND (ACTIVE < '#now#'))",
        visibleCols: ['email', 'admin', 'id'],

      },
      extendedscrollactions: [
        {
          name: 'BtnEdit',
          icon: 'edit'
        },
        {
          name: 'BtnCreate',
          icon: 'add_circle_outline'
        },
        {
          name: 'BtnDuplicate',
          icon: 'library_books'
        },
        {
          name: 'BtnDelete',
          icon: 'delete'
        }
      ]
    }
  },
  methods: {
    handleEvent: function (actionCommand, event, line) {
      if (actionCommand === 'BtnEdit') this.actionOpenUsermaintenanceDialog(line, 'edit')
      if (actionCommand === 'BtnCreate') this.actionOpenUsermaintenanceDialog(line, 'create')
      if (actionCommand === 'BtnDuplicate') this.actionOpenUsermaintenanceDialog(line, 'duplicate')
      if (actionCommand === 'BtnDelete') this.actionDelete(line)
      if (actionCommand === this.callbackUsermaintenanceDlg) this.actionCloseUsermaintenanceDialog(event)
    },
    async actionDelete (line) {
      try {
      const msg = JSON.stringify(line['#lbk#'])
        await this.$util.interactionDialog.popup(this.screenmodel.translate('popupTitle'), this.screenmodel.translate(msg), 750)
        refreshScroll (true)
      } catch (error) {
        console.log('klklk')
      }
    },
    async actionOpenUsermaintenanceDialog (line, modus) {
       this.dlgDataModel = await this.createUserMaintenanceDialogDatamodel(line, modus)
       const inValidData = ((modus !== 'create') && (this.dlgDataModel.bokey.id === 0 ))
       if (!inValidData) this.editDialogOpened = true
    },
    async createUserMaintenanceDialogDatamodel (line, modus) {
      let result = {}
      result.modus = modus
      let dlgBoKey =  { id: 0}
      result.user = {} 
      result.createModus = (modus === 'create')
      if (modus !== 'create') {
        dlgBoKey = line['#lbk#']
        const response = await usermaintenanceService.read(dlgBoKey.id)
        result.user = response.data
      }
      console.log(dlgBoKey)
      result.bokey = dlgBoKey
      return result
    },
    actionCloseUsermaintenanceDialog (event) {
      //console.log(JSON.stringify(event))
      this.editDialogOpened = false
      this.refreshScroll(this.dlgDataModel.changedBokey !== undefined)
    },
    refreshScroll (update) {
      if (update) this.lastrefreshRequest = new Date().toISOString()
      this.$refs.scroll.requestFocus()
    }
  },
  async beforeMount () {
    const user = this.$store.getters['ctxtStore/get']
    this.screenmodel = await ScreenmodelService.getScreenmodel('vue_UserScroll_Main',user.language)
    this.ready = true
  }
}
</script>
