<template>
  <div>
    <v-progress-circular v-if="!ready" indeterminate color="primary" />
    <DataScroll v-if="ready" :screenmodel="screenmodel" :scrolldefinition="scrolldefinition" :extendedscrollactions="extendedscrollactions" :toolBoxActions="toolBoxActions" @handleEvent="handleEvent" :lineCount="lineCount"/>
  </div>
</template>

<script>
import DataScroll from '@/core/components/datascroll'
import ScreenmodelService from '@/services/ScreenmodelService'


export default {
  name: 'User',
  components: {
    DataScroll
  },
  data () {
    return {
      lineCount: 200,
      ready: false,
      scrolldefinition: {
        scrollBO: 'UserScrollBO',
        scrollID: 'Userscoll',
        curSort: 'email'
      },
      extendedscrollactions: [
        {
          name: 'BtnEdit',
          icon: 'edit'
        },
        {
          name: 'BtnCreate',
          icon: 'add'
        },
        {
          name: 'BtnDelete',
          icon: 'delete'
        },
        {
          name: 'BtnDuplicate',
          icon: 'file_copy'
        },
        {
          name: 'BtnEscape',
          icon: 'clear'
        }
      ],
      toolBoxActions: [
        {
          name: 'ToolBoxAction1'
        },
        {
          name: 'Abort',
          icon: 'clear'
        }
      ]
    }
  },
  methods: {
    handleEvent: function (actionCommand, event, line) {
      if (actionCommand === 'BtnEscape') this.$router.push('/reservations')
      if (actionCommand === 'BtnEdit') alert('Edit: \n' + JSON.stringify(line))
      if (actionCommand === 'toolBoxEvent') alert('ToolBox: \n' + JSON.stringify(line))
    }
  },
  async beforeMount () {
    const screenID = 'usermaintenance'
    const language = 'de'

    this.screenmodel =  await ScreenmodelService.getScreenmodel(screenID, language)
    this.ready = true
  }
}
</script>

<style>
</style>
