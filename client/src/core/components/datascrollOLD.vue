<template>
  <div ref="scrollContainer" v-if="ready" v-on:keyup="handleKeyEvent" tabindex="0">
    <v-layout v-resize="onResize" column>
      <v-data-table :headers=computedHeaders :items=model.lines hide-default-header hide-default-footer :class="{mobile: isMobile}" must-sort :loading="loading" disable-pagination fixed-header :height="computedHeight">
        <v-progress-linear indeterminate v-slot:progress/>
        <template v-if="!isMobile" v-slot:header="props">
          <thead fixed-header>
            <tr>
              <th v-for="header in computedHeaders" :key=header.value @click="changeSort(header)">
                <span :style="getHeaderStyle(header)"> {{ header.text }} </span>
                <v-icon v-if="header.searchable" small :style="getHeaderStyle(header)">arrow_downward</v-icon>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:item="props" >
          <tr v-if="!isMobile" v-hammer:pan="processSwipeEvent">
            <td :ref="calcRef(props.item.linenumber)" v-hammer:tap="(e) => processTapEvent(e, props.item)" :class="getClass(props.item)" v-for="header in computedHeaders" :key="header.value" @click="handleClick(props.item)" @dblclick="handleEvent('BtnEdit', props.item)" @wheel="processScrollEvent()">
              <v-edit-dialog v-if="(header.searchable && (props.item === curLine))" lazy @save="saveSearch(props.item, header.value, props.item[header.value])" @open="openSearch()" @close="closeSearch">
                {{ props.item[header.value] }}
                <template v-slot:input>
                  <v-text-field v-model="props.item[header.value]" single-line/>
                </template>
              </v-edit-dialog>
              <span v-else>{{ props.item[header.value] }}</span>
            </td>
          </tr>
          <tr v-else>
            <td :ref="calcRef(props.item.linenumber)" :class="getClass(props.item)">
              <ul v-if="lineCount !== undefined" class="flex-content">
                <li v-hammer:tap="(e) => processTapEvent(e, props.item)" class="flex-item" @click="handleClick(props.item)" v-for="header in computedHeaders" :key="header.value" :data-label="header.text"> {{ props.item[header.value] }} </li>
              </ul>
              <ul v-else v-hammer:pan="processSwipeEvent" class="flex-content">
                <li v-hammer:tap="(e) => processTapEvent(e, props.item)" class="flex-item" @click="handleClick(props.item)" v-for="header in computedHeaders" :key="header.value" :data-label="header.text"> {{ props.item[header.value] }} </li>
              </ul>
            </td>
          </tr>
        </template>
        <template v-slot:no-data>
          <v-alert color="surface" :value="true">{{translate('noDataFound')}}</v-alert>
        </template>
        <template v-slot:footer>
          <Footer :actions="actions" :screenmodel="screenmodel"/>
        </template>
      </v-data-table>
    </v-layout>
    <ToolBox v-if="isToolBoxOpen" :screenmodel="screenmodel" :actions="toolBoxActions" @handleEvent="handleToolBoxEvent"/>
  </div>
</template>

<script>
import ScrollModel from '@/core/data-models/scrollmodel'
import Scrolldefinition from '@/core/data-models/scrolldefinition'
import Footer from '@/core/components/footer'
import ToolBox from '@/core/components/toolBox'

export default {
  name: 'scrollContainer',
  components: {
    Footer,
    ToolBox
  },
  props: {
    scrolldefinition: Object,
    extendedscrollactions: Array,
    screenmodel: Object,
    toolBoxActions: Array,
    lineCount: Number
  },
  computed: {
    computedHeaders: function () {
      let sortHeader
      let compHeaders = []
      let sortColIncluded = false
      if (this.model.headers !== undefined) {
        if ((this.scrolldefinition.visibleCols === undefined) || (this.scrolldefinition.visibleCols.length === 0)) compHeaders = Object.assign(compHeaders, this.model.headers)
        else {
          this.model.headers.forEach((header) => {
            let index = this.scrolldefinition.visibleCols.indexOf(header.value)
            if (index > -1) compHeaders.splice(index, 0, header)
            if (header.value === this.model.pagination.sortBy) {
              sortHeader = header
              if (index > -1) sortColIncluded = true
            }
          })
        }
        if (!sortColIncluded && (sortHeader !== undefined)) compHeaders.unshift(sortHeader)
      }
      return compHeaders
    },
    computedHeight: function () {
      return (this.innerHeight - this.headerHeight - this.footerHeight) + 'px'
    }
  },
  methods: {
    processTapEvent: function (e, line) {
      var timeout
      var currentTime = new Date().getTime()
      var tapLength = currentTime - this.lastTap
      clearTimeout(timeout)
      if (tapLength < 500 && tapLength > 0 && this.lastTapLine === line) {
        this.handleEvent('BtnEdit', line)
        event.preventDefault()
      } else {
        timeout = setTimeout(function () {
          clearTimeout(timeout)
        }, 500)
      }
      this.lastTap = currentTime
      this.lastTapLine = line
    },
    requestFocus: function () {
      this.$nextTick(this.$refs.scrollContainer.focus())
    },
    getHeaderStyle: function (header) {
      return this.isCurSort(header) ? 'font-weight: bold; color: black; float: left' : 'font-weight: normal; float: left'
    },
    isCurSort: function (header) {
      return (this.model.pagination.sortBy === header.value)
    },
    openSearch: function () {
      this.isSearchOpen = true
    },
    closeSearch: function () {
      this.isSearchOpen = false
      this.requestFocus()
    },
    saveSearch: async function (line, headerValue, searchValue) {
      this.scrollRequestData.curSort = headerValue
      line[headerValue] = searchValue
      this.pgDown(line.linenumber)
    },
    calcRef: function (linenumber) {
      return ('refItem_line_' + linenumber)
    },
    processSwipeEvent: async function (event) {
      if (((this.lineCount === undefined) || (this.lineCount === 0)) && (event.isFinal) && (event.pointerType === 'touch')) {
        if (event.deltaY > 50) {
          this.loading = true
          await this.pgUp()
          this.loading = false
        }
        if (event.deltaY < -50) {
          this.loading = true
          await this.pgDown()
          this.loading = false
        }
      }
    },
    handleClick: function (line) {
      if (!this.loading) {
        if (!this.isMultiselect) this.curLine = line
        if (this.isMultiselect) this.curLine = line
      }
    },
    processScrollEvent: function () {
      if ((!this.loading) && ((this.lineCount === undefined) || (this.lineCount === 0))) (window.event.deltaY > 0) ? this.scrollDown() : this.scrollUp()
    },
    getClass: function (line) {
      let result = 'unselected'
      if (line === this.curLine) result = 'selected'
      this.isMobile ? result += ' mobileHeight' : result += ' desctopHeight'
      return result
    },
    translate: function (untranslated) {
      let result = untranslated
      try {
        result = this.screenmodel.translate(untranslated)
      } catch {}
      return result
    },
    processKeyEvent: function (event) {
      let used = false
      if (event.keyCode === 27) { this.handleEvent('BtnEscape'); used = true }
      if (event.keyCode === 113) { this.handleEvent('BtnEdit'); used = true }
      if (event.keyCode === 34) { this.pgDown(); used = true }
      if (event.keyCode === 33) { this.pgUp(); used = true }
      if (event.keyCode === 36) { this.first(); used = true }
      if (event.keyCode === 35) { this.last(); used = true }
      if (event.keyCode === 38) { this.scrollUp(); used = true }
      if (event.keyCode === 40) { this.scrollDown(); used = true }
      return used
    },
    scrollUp () {
      if (this.model.lines.indexOf(this.curLine, 0) === 0) this.pgUp()
      else this.curLine = this.model.lines[this.model.lines.indexOf(this.curLine, 0) - 1]
    },
    scrollDown () {
      let lastvisibleLineNr = this.calcLastVisibleLineIndex()
      if (this.curLine.linenumber === lastvisibleLineNr) this.pgDown(lastvisibleLineNr)
      else this.curLine = this.model.lines[this.model.lines.indexOf(this.curLine, 0) + 1]
    },
    calcLastVisibleLineIndex () {
      let lastvisible = -1
      let linerefs = Object.values(this.$refs)
      this.calcLineCount()
      let maxOffset = this.scrollheight - this.defaultLineheight
      let linecounter = this.model.lines.length - 1
      while ((linecounter >= 0) && (lastvisible < 0)) {
        let line = this.model.lines[linecounter]
        if (linerefs[linecounter] !== undefined) {
          let curLine = linerefs[linecounter]
          if (curLine !== undefined) {
            if (!this.isMobile) {
              if ((curLine[0] !== undefined) && (curLine[0].offsetTop !== undefined)) {
                if (maxOffset > curLine[0].offsetTop) lastvisible = line.linenumber
              } else {
                if (curLine.offsetTop !== undefined) {
                  if (maxOffset > curLine.offsetTop) lastvisible = line.linenumber
                }
              }
            } else {
              if ((curLine[0] !== undefined) && (curLine[0].offsetParten !== undefined) && (curLine[0].offsetParten.offsetTop !== undefined)) {
                if (maxOffset > curLine[0].offsetTop) lastvisible = line.linenumber
              } else {
                if (curLine.offsetTop !== undefined) {
                  if (maxOffset > curLine.offsetTop) lastvisible = line.linenumber
                }
              }
            }
          }
          linecounter--
        }
      }
      return lastvisible
    },
    async help () {
      alert('Help not yet implemented!')
    },
    async pgUp () {
      this.loading = true
      let firstLine
      try {
        firstLine = this.model.lines[0]
      } catch {
      }
      const params = {
        mandant: this.mandCtxt.mandantenID,
        mail: this.mandCtxt.email,
        scrollRequest: this.generateScrollRequest(false)
      }
      if (firstLine !== undefined) params.scrollRequest.start = firstLine
      const response = await this.$serviceUtil.getAuthorized('keycloak/vue/scroll/getScrollModel', params)
      this.model = new ScrollModel(response, this.screenmodel)
      this.curLine = this.model.lines[this.model.lines.length - 1]
      this.loading = false
      this.requestFocus()
    },
    async pgDown (curLineIndex) {
      this.loading = true
      let lastLineIndex
      let lastLine
      try {
        lastLineIndex = ((curLineIndex === undefined) || (typeof curLineIndex !== 'number')) ? this.calcLastVisibleLineIndex() : curLineIndex
        lastLine = this.model.lines[lastLineIndex]
      } catch {
      }
      const params = {
        mandant: this.mandCtxt.mandantenID,
        mail: this.mandCtxt.email,
        scrollRequest: this.generateScrollRequest(true)
      }
      if (lastLine !== undefined) params.scrollRequest.start = lastLine
      const response = await this.$serviceUtil.getAuthorized('keycloak/vue/scroll/getScrollModel', params)
      this.model = new ScrollModel(response, this.screenmodel)
      this.curLine = this.model.lines[0]
      this.loading = false
      this.requestFocus()
    },
    async first () {
      this.loading = true
      const params = {
        mandant: this.mandCtxt.mandantenID,
        mail: this.mandCtxt.email,
        scrollRequest: this.generateScrollRequest(true)
      }
      const response = await this.$serviceUtil.getAuthorized('keycloak/vue/scroll/getScrollModel', params)
      this.model = new ScrollModel(response, this.screenmodel)
      this.curLine = this.model.lines[0]
      this.loading = false
      this.requestFocus()
    },
    async last () {
      this.loading = true
      const params = {
        mandant: this.mandCtxt.mandantenID,
        mail: this.mandCtxt.email,
        scrollRequest: this.generateScrollRequest(false)
      }
      const response = await this.$serviceUtil.getAuthorized('keycloak/vue/scroll/getScrollModel', params)
      this.model = new ScrollModel(response, this.screenmodel)
      this.curLine = this.model.lines[this.model.lines.length - 1]
      this.loading = false
      this.requestFocus()
    },
    generateScrollRequest (adirection) {
      return {
        scrollBO: this.scrollRequestData.scrollBO,
        appfilter: this.scrollRequestData.appfilter,
        scrollID: this.scrollRequestData.scrollID,
        rows: ((this.lineCount !== undefined) && (this.lineCount > 0) ? this.lineCount : this.calcLineCount()),
        direction: adirection,
        sort: this.scrollRequestData.curSort
      }
    },
    calcLineCount () {
      this.scrollheight = (window.innerHeight - this.footerHeight - this.headerHeight)
      if (!this.isMobile) this.scrollheight -= this.scrollHeaderHeight
      this.defaultLineheight = (this.isMobile ? 100 : 50)
      return parseInt((this.scrollheight / this.defaultLineheight))
    },
    handleToolBoxEvent: function (event) {
      this.isToolBoxOpen = false
      if (event !== 'Abort') this.handleEvent('toolBoxEvent', event)
    },
    handleKeyEvent: function (event) {
      this.handleEvent('keyEvent', event)
    },
    handleEvent: function (actionCommand, event) {
      if ((!this.isSearchOpen) && (!this.isToolBoxOpen) && (!this.loading)) {
        if (actionCommand === 'toolBoxEvent') this.$emit('handleEvent', actionCommand, event, this.curLine)
        if ((actionCommand === 'keyEvent') && (!this.processKeyEvent(event))) this.$emit('handleEvent', actionCommand, event, this.curLine)
        if (((this.extendedscrollactionsIDs.indexOf(actionCommand) > -1) && (actionCommand !== 'keyEvent'))) this.$emit('handleEvent', actionCommand, event, this.curLine)
      }
    },
    onResize () {
      if ((!this.scrollRequestData.mobileSupported !== true) && (window.innerWidth < 750)) this.isMobile = true
      else this.isMobile = false
    },
    async changeSort (header) {
      this.loading = true
      if (this.model.sortable[header.value] !== undefined) {
        if (this.model.pagination.sortBy !== header.value) {
          this.scrollRequestData.curSort = header.value
          await this.pgDown(this.curLine.linenumber)
        }
      }
      this.loading = false
    },
    openToolBox () {
      this.isToolBoxOpen = true
    }
  },
  data () {
    return {
      innerHeight: 0,
      footerHeight: 100,
      headerHeight: 50,
      scrollHeaderHeight: 56,
      lastTap: 0,
      lastTapLine: {},
      searchValue: '',
      pagination: {},
      isSearchOpen: false,
      isToolBoxOpen: false,
      ready: false,
      loading: true,
      isMultiselect: true,
      model: {},
      extendedscrollactionsIDs: [],
      curLine: [],
      isMobile: false,
      scrollRequestData: new Scrolldefinition(),
      actions: [
        {
          name: 'BtnHelp',
          event: this.help,
          icon: 'help'
        },
        {
          name: 'BtnPageUp',
          event: this.pgUp,
          icon: 'chevron_left'
        },
        {
          name: 'BtnPageDown',
          event: this.pgDown,
          icon: 'chevron_right'
        },
        {
          name: 'BtnStart',
          event: this.first,
          icon: 'first_page'
        },
        {
          name: 'BtnEnd',
          event: this.last,
          icon: 'last_page'
        }
      ]
    }
  },
  beforeMount: async function () {
    this.innerHeight = window.innerHeight
    this.mandCtxt = this.$store.getters['ctxtStore/get']
    this.scrollRequestData.scrollBO = this.scrolldefinition.scrollBO
    this.scrollRequestData.scrollID = this.scrolldefinition.scrollID
    this.scrollRequestData.appfilter = this.scrolldefinition.appfilter
    this.scrollRequestData.curSort = this.scrolldefinition.curSort
    if ((this.toolBoxActions !== undefined) && (this.toolBoxActions.length !== 0)) {
      this.actions.push({
        name: 'BtnToolBox',
        event: this.openToolBox,
        icon: 'menu'
      })
    }
    this.extendedscrollactions.forEach(element => {
      element.event = () => { return this.handleEvent(element.name, 'buttonEvent') }
      this.actions.push(element)
      this.extendedscrollactionsIDs.push(element.name)
    })
    this.onResize()
    this.ready = true
    try {
      await this.first()
    } catch {
    }
    this.loading = false
  }
}
</script>

<style scoped>
.selected {
  background: #3297FD;
  color: white;
  text-align: left;
  overflow: hidden;
}
.unselected {
  text-align: left;
  overflow: hidden;
}
.mobileHeight {
  height: 100px;
  max-height: 100px;
}
.desctopHeight {
  height: 50px;
  max-height: 50px;
}

@media screen and (max-width: 750px) {
    .mobile table.v-table tr {
      max-width: 100%;
      position: relative;
      display: block;
    }

    .mobile table.v-table tr td {
      display: flex;
      width: 100%;
    }

    .mobile li::before {
      font-size: 80%;
      content: attr(data-label);
      text-align: left;
      display: block;
      font-weight: bold
    }
}

.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
  background: transparent;
}

.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  overflow: hidden;
}

.flex-item {
  width: 33%;
  padding: 5px;
  overflow: hidden;
}
</style>
