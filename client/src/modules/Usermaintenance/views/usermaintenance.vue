<template>
  <div>
    <v-progress-circular v-if="!ready" indeterminate color="primary" />
    <UsermaintenanceDialog v-if="(ready && editDialogOpened)" @handleEvent="handleEvent" :screenmodel="screenmodel" :dataModel="dlgDataModel" :callbackActionCommand="callbackUsermaintenanceDlg"/>
    <DataScroll ref="scroll" v-if="ready" :lastrefreshRequest="lastrefreshRequest" :screenmodel="screenmodel" :scrolldefinition="scrolldefinition" :extendedscrollactions="extendedscrollactions" @handleEvent="handleEvent" :lineFactor="lineFactor"/>
  </div>
</template>

<script>
import DataScroll from '@/core/components/scroll/datascroll'
import ScreenmodelService from '@/services/ScreenmodelService'
import UsermaintenanceDialog from '@/modules/usermaintenance/dialogs/usermaintenanceDlg.vue'

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
        curSort: 'email'
      },
      extendedscrollactions: [
        {
          name: 'BtnEdit',
          icon: 'edit'
        }
      ]
    }
  },
  methods: {
    handleEvent: function (actionCommand, event, line) {
      if (actionCommand === 'BtnEdit') this.actionOpenUsermaintenanceDialog(line)
      if (actionCommand === this.callbackUsermaintenanceDlg) this.actionCloseUsermaintenanceDialog(event)
    },
    async actionOpenUsermaintenanceDialog (line) {
      alert('todo: implement actionOpenUserDialog' + line)
    },
    actionCloseUsermaintenanceDialog (event) {
      alert(JSON.stringify(event))
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
    console.log(JSON.stringify(user))
    this.screenmodel = await ScreenmodelService.getScreenmodel('vue_UserScroll_Main',user.language)
    this.ready = true
  }
}
</script>
