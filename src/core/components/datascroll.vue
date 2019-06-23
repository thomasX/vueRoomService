<template>
  <v-container>
      <v-app id="inspire">
      <v-toolbar dark color="primary" fixed>
          <v-toolbar-title class="white--text">{{model.title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <logoutBtn/>
      </v-toolbar>
      <v-layout v-resize="onResize" column style="padding-top:56px">
        <v-data-table :headers=model.headers :items=model.lines :search="search" :hide-headers="isMobile"  :hide-actions="true"  :class="{mobile: isMobile}">
        <template slot="items" slot-scope="props" >
          <tr v-if="!isMobile" >
            <td class="text-xs-right" v-for="aValue in Object.values(props.item) " :key="aValue" >{{ aValue }}</td>
          </tr>
          <tr v-else>
            <td>
              <div class="flex-content" >
                <div class="flex-item"  v-for="(aValue,index) in Object.values(props.item)" :cheaders="Object.values(model.headers)" :key="index" >
                    <div>{{ colheader(index) }}</div>
                    <span>{{ aValue }} </span> 
                </div>
              </div>
            </td>
          </tr>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
        </v-data-table>
      </v-layout>
      <ButtonPanel18 @buttonR1C1="buttonR1C1"/>
    </v-app>
  </v-container>
</template>

<script>
import logoutBtn from '@/core/components/logoutBtn'
import ButtonPanel18 from '@/core/components/buttonPanel18'
/* --- import axios from 'axios' --- */

export default {
  name: 'menue',
  components: {
    logoutBtn,
    ButtonPanel18
  },
  props: {
    model: Object 
  },
  methods: {
    async buttonR1C1 () {
        alert('R1C1')
    }, 
    colheader: function (colheaderindex ) {
      let headercol = this.model.headers[colheaderindex]
      let result = undefined === headercol ? '' : headercol.text
      return result
    },  
    onResize () {
      if (window.innerWidth < 769) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.desserts.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    }
  },
  data () {
    return {
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      search: '',
      isMobile: false,
    }
  }
}
</script>

<style scoped>
.mobile {
  color: #333;
}

@media screen and (max-width: 768px) {
    .mobile table.v-table tr {
    max-width: 100%;
    position: relative;
    display: block;
    }

    .mobile table.v-table tr:nth-child(odd) {
    border-left: 6px solid deeppink;
    }

    .mobile table.v-table tr:nth-child(even) {
    border-left: 6px solid cyan;
    }

    .mobile table.v-table tr td {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    height: auto;
    padding: 10px;
    }

    .mobile table.v-table tr td ul li:before {
    content: attr(data-label);
    padding-right: .5em;
    text-align: left;
    display: block;
    color: #999;
    }

    .v-datatable__actions__select {
    width: 50%;
    margin: 0px;
    justify-content: flex-start;
    }

    .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
    background: transparent;
    }
}

.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}
</style>
