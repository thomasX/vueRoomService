<template>
  <v-card id="apanel" class="white elevation-2">
    <v-toolbar name="panelToolbar" flat dense color="primary"  dark>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <slot name="action" />
    </v-toolbar>

    <div class="pl-4 pr-4 pt-2 pb-2">
      <slot>
        No slot content defined.
      </slot>
    </div>
  </v-card>
</template>

<script>
export default {
  props: [
    'title'
  ]
}
</script>

<style scoped>
</style>