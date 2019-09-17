<template>
  <datascroll :model=scrollmodel></datascroll>
</template>

<script>
import datascroll from  '@/core/components/scroll/datascroll'
import Scrollmodel from '@/core/models/scrollmodel'
export default {
  name: 'menue',
  components:{
    datascroll
  },
  data: function () {
    return {
      scrollmodel: new Scrollmodel(
        'menü',
        [
          { text: 'Prog.Nr',
            align: 'left',
            value: 'toolID'
          },
          { text: 'Bennennung',
            align: 'left',
            value: 'description'
          }
        ],
        [{ 
          toolID: 1,
          description: 'Menü',
          routePath: '/'
        },
        { 
          toolID: 2,
          description: 'About',
          routePath: '/about'
        },
        { 
          toolID: 3,
          description: 'home .. alt',
          routePath: '/'
        }
        ],
        'toolID')
    }
  }

}
</script>

<style>

</style>
