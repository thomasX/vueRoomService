<template>
    <v-footer fixed height="110" color="#cfcfcf">
        <v-layout column>
          <v-layout row align-center justify-space-between>
            <v-btn flat block style="margin: 0px" @click="buttonR1C1">R1C1</v-btn>
            <v-btn flat block style="margin: 0px" @click="testR1C2">R1C2</v-btn>
            <v-btn flat block style="margin: 0px">R1C3</v-btn>
            <v-btn flat block style="margin: 0px">R1C4</v-btn>
            <v-btn flat block style="margin: 0px">R1C5</v-btn>
            <v-btn flat block style="margin: 0px">R1C6</v-btn>
          </v-layout>
          <v-layout row align-center justify-space-between>
            <v-btn flat block style="margin: 0px">R2C1</v-btn>
            <v-btn flat block style="margin: 0px">R2C2</v-btn>
            <v-btn flat block style="margin: 0px">R2C3</v-btn>
            <v-btn flat block style="margin: 0px">R2C4</v-btn>
            <v-btn flat block style="margin: 0px">R2C5</v-btn>
            <v-btn flat block style="margin: 0px">R2C6</v-btn>
          </v-layout>
          <v-layout row align-center justify-space-between>
            <v-btn flat block style="margin: 0px">R3C1</v-btn>
            <v-btn flat block style="margin: 0px">R3C2</v-btn>
            <v-btn flat block style="margin: 0px">R3C3</v-btn>
            <v-btn flat block style="margin: 0px">R3C4</v-btn>
            <v-btn flat block style="margin: 0px">R3C5</v-btn>
            <v-btn flat block style="margin: 0px">R3C6</v-btn>
          </v-layout>
        </v-layout>
    </v-footer>
</template>

<script>
/* import axios from 'axios'
*/
export default {
  props: {
    method: { type: Function }
  },
  methods: {
    async buttonR1C1 () {
      this.$emit('buttonR1C1')
    },
    async testR1C2 () {
      alert ('r1c2')
    }
  }
}
</script>
