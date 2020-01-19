<template>
    <div>
        <v-progress-circular v-if="!ready" indeterminate color="primary"/>
        <UserMaintenanceDialog v-if="(ready && dlgOpened)" @handleEvent="handleEvent" :screenmodel="screenmodel" :dataModel="dlgDataModel" :callbackActionCommand="callbackUsermaintenanceDlg"/>
    </div>
</template>

<script>
import UserMaintenanceDialog from '@/modules/Usermaintenance/dialogs/usermaintenanceDlg.vue'

export default {
  name: 'user-logon',
  components: {
    UserMaintenanceDialog
  },
  data: () =>{
    return {
      ready: true,
      dlgOpened: true,
      screenmodel: {},
      callbackUsermaintenanceDlg: 'actionCloseDialog',
      dlgDataModel: { 
        modus: 'register',
        bokey: { id: 0 },
        dto: { admin: false },
        createModus: true }
    }
  },
  methods: {
    handleEvent (actionCommand, data, selectedLine) {
      console.log('actionCommand received:jjj' + actionCommand)
      if (actionCommand === 'actionCloseDialog') this.actionCloseDialog()
    },
    actionCloseDialog () {
      this.$router.push({
        name: 'home'
      })
    }
  }

}
</script>

<style>

</style>
