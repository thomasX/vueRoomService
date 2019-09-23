<template>
  <div>
    <v-progress-circular v-if="!ready" indeterminate color="primary" />
    <DataScroll ref="scroll" v-if="ready" :lastrefreshRequest="lastrefreshRequest" :screenmodel="screenmodel" :scrolldefinition="scrolldefinition" :extendedscrollactions="extendedscrollactions" @handleEvent="handleEvent" :lineFactor="lineFactor"/>
  </div>
</template>

<script>
import DataScroll from '@/core/components/scroll/datascroll'
import Screenmodel from '@/core/data-models/screenmodel'
import ScreenmodelService from '@/services/ScreenmodelService'

// import TransportFinishingDialog from '@/modules/transport/dialogs/TransportFinishingDialog.vue'
import UserScrollService from '@/modules/Usermaintenance/userscrollService'

export default {
  name: 'UserScroll_Main',
  components: {
    DataScroll
  },
  data () {
    return {
      ready: false,
      lastrefreshRequest: '',
      // callbackTransportFinishingDlg: 'actionCloseTransportFinishingDialog',
      editDialogOpened: false,
      dataModel: {},
      lineFactor: 10,
      scrolldefinition: {
        scrollBO: 'at.felder.FERPS.EJB.Session.Transport.TransportScrollBO',
        scrollID: 'vue_Userscroll_Main',
        // appfilter: "((GRP like '%|G43|%') AND (ACTIVE < '#now#'))",
        // visibleCols: ['PRIOR', 'ANR', 'BENENNUNG', 'STK', 'CURSTART', 'CURSTOP', 'BEMERKG', 'END_CLAGTYP', 'MARKUP'],
        curSort: 'EMAIL'
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
      if (actionCommand === 'BtnEdit') this.actionOpenUserDialog(line)
      if (actionCommand === this.callbackTransportFinishingDlg) this.actionCloseTransportFinishingDialog(event)
    },
    async actionOpenUserDialog (line) {
      // implement later
    },
    actionCloseUserDialog (event) {
      this.editDialogOpened = false
      this.refreshScroll(this.dlgDataModel.changedBokey !== undefined)
    },
    refreshScroll (update) {
      if (update) this.lastrefreshRequest = new Date().toISOString()
      this.$refs.scroll.requestFocus()
    }
  },
  async beforeMount () {
    this.userscrollService = new UserScrollService(this.$api)
    this.user = this.$store.state.user
    this.screenmodel = await ScreenmodelService.getScreenmodel('vue_UserScroll_Main',user.language)
    this.ready = true
  }
}
</script>
