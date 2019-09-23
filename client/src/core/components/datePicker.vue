<template>
  <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
    <template v-slot:activator="{ on }">
      <v-text-field outlined v-model="dateFormatted" placeholder=" " :label="label" hint="YYYY-MM-DD" persistent-hint @blur="date = dateFormatted" v-on="on" :error-messages="error" readonly/>
    </template>
    <v-date-picker v-model="date" no-title @input="closeMe"></v-date-picker>
  </v-menu>
</template>
<script>
import dateTimeUtil from '@/core/services/DateTimeUtil'
export default {
  props: {
    value: String,
    label: String,
    error: String
  },
  data: function () {
    return {
      date: '',
      dateFormatted: dateTimeUtil.convertDate2DayString(this.value),
      menu1: false
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = val
    }
  },
  methods: {
    closeMe: function () {
      this.menu1 = false
      this.$emit('input', this.date)
    }
  },
  beforeMount: function () {
    if (this.value !== undefined) this.date = dateTimeUtil.convertDate2DayString(new Date(this.value))
  }
}
</script>
