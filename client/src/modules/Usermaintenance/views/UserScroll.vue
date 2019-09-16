<template>
  <div>
    <v-progress-circular v-if="!ready" indeterminate color="primary" />
    <DataScroll ref="scroll" v-if="ready" :lastrefreshRequest="lastrefreshRequest" :screenmodel="screenmodel" :scrolldefinition="scrolldefinition" :extendedscrollactions="extendedscrollactions" @handleEvent="handleEvent" :lineFactor="lineFactor"/>
  </div>
</template>

<script>
import DataScroll from '@/core/components/scroll/datascroll'
import Screenmodel from '@/core/data-models/screenmodel'
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
      // const dlgBoKey = line['#lbk#']
      // const dto = await this.transportCtrl.getTransportDTO(this.mandCtxt, dlgBoKey)
      // await this.transportCtrl.changeMarkup(this.mandCtxt, dlgBoKey, new Date(dto.Date).toISOString(), 'true')
      // this.dlgDataModel = await this.transportCtrl.getTransportFinishingDialogDataModel(dlgBoKey)
      // this.editDialogOpened = true
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
    this.transportCtrl = new TransportCtrl(this.$api)
    this.mandCtxt = this.$store.getters['ctxtStore/get']
    this.screenmodel = await new Screenmodel().init(this.mandCtxt.mandantenID, this.mandCtxt.email, 'vue_UserScroll_Main', this.$api)
    this.ready = true
  }
}
</script>
