<template>
    <div>
        <v-progress-circular v-if="!ready" indeterminate color="primary"/>
        <LoginDialog v-if="ready && dlgOpened" @handleEvent="handleEvent" :screenmodel="screenmodel" :dataModel="dlgDataModel" :callbackActionCommand="callbackLoginDlg"/>
    </div>
</template>

<script>
import LoginDialog from '@/modules/authentication/views/dialogs/loginDlg.vue'

export default {
  name: 'user-logon',
  components: {
    LoginDialog
  },
  data: () =>{
    return {
      ready: true,
      dlgOpened: true,
      screenmodel: {},
      callbackLoginDlg: 'actionCloseDialog',
      dlgDataModel: { email: '', password: '', bokey: { id: '' } }
    }
  },
  methods: {
    handleEvent (actionCommand, data, selectedLine) {
      console.log('actionCommand received:' + actionCommand)
    },
    actionCloseDialog () {}
  }

}
</script>

<style>

</style>
