<template>
  <div ref="scrollContainer" v-if="ready" v-on:keyup="handleKeyEvent" v-on:keydown.prevent tabindex="0">
    <v-layout v-resize="onResize" column>
      <v-data-table ref="dataTable" :headers=computedHeaders :items=model.lines :class="{mobile: isMobile}" :loading="loading" :height="getHeight()" hide-default-header hide-default-footer disable-pagination must-sort fixed-header>
        <v-progress-linear indeterminate v-slot:progress/>
        <template v-if="!isMobile" v-slot:header="props">
          <thead fixed-header ref="dataTableFixedHeader">
            <tr>
              <th v-for="header in computedHeaders" :key=header.value @click="changeSort(header.value)">
                <span :style="getHeaderStyle(header)"> {{ header.text }} </span>
                <v-icon v-if="header.searchable" :style="getHeaderStyle(header)" small>mdi-menu-down</v-icon>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:item="props">
        <!-- not mobile START -->
          <tr v-if="!isMobile" v-touch:swipe="processSwipeEvent" @click="handleClick(props.item)" v-touch:tap="(e) => processTapEvent(e, props.item)" >
            <td :ref="'refItem_line_' + props.item.linenumber" :style="getStyle(props.item, header.value)" @wheel="processWheelEvent" v-for="header in computedHeaders" :key="header.value">
              <v-edit-dialog v-if="(header.searchable && scrollRequestData.searchSupported && (props.item === curLine))" :ref="('editDlg_' + props.item.linenumber + '_' + header.value)" @save="saveSearch(props.item, header.value, props.item[header.value]['#val#'])" @open="openSearch" @close="closeSearch" lazy>
                {{ props.item[header.value]['#val#'] }}
                <template v-slot:input>
                  <v-text-field @focus="(e) => e.target.select()" v-model="props.item[header.value]['#val#']" single-line/>
                </template>
              </v-edit-dialog>
              <span v-else>{{ props.item[header.value]['#val#'] }}</span>
            </td>
          </tr>
        <!-- not mobile END-->
        <!-- mobile START -->
          <tr v-else v-touch:swipe="processSwipeEvent" @click="handleClick(props.item)" v-touch:tap="(e) => processTapEvent(e, props.item)">
            <td :ref="'refItem_line_' + props.item.linenumber" :style="getStyle(props.item)">
              <ul class="flex-content">
                <li :style="getMobileStyle(props.item, header)" v-for="header in computedHeaders" :key="header.value" :data-label="header.text">
                  <v-edit-dialog :ref="('editDlg_' + props.item.linenumber + '_' + header.value)" v-if="(header.searchable && scrollRequestData.searchSupported && (props.item === curLine))" lazy @save="saveSearch(props.item, header.value, props.item[header.value]['#val#'])" @open="openSearch" @close="closeSearch">
                    {{ props.item[header.value]['#val#'] }}
                    <template v-slot:input>
                      <v-text-field @focus="(e) => e.target.select()" v-model="props.item[header.value]['#val#']" single-line/>
                    </template>
                  </v-edit-dialog>
                  <span v-else>{{ props.item[header.value]['#val#'] }}</span>
                </li>
              </ul>
            </td>
          </tr>
        <!-- mobile END -->
        </template>
        <template v-slot:no-data> <v-alert color="surface" :value="true">{{translate('noDataFound')}}</v-alert> </template>
        <template v-slot:footer> <Footer ref="dateTableFixedFooter" :actions="actions" :screenmodel="screenmodel"/> </template>
      </v-data-table>
    </v-layout>
    <ToolBox v-if="isToolBoxOpen" :screenmodel="screenmodel" :actions="toolBoxActions" @handleEvent="handleToolBoxEvent"/>
  </div>
</template>

<script>
import Scrolldefinition from '@/core/data-models/scrolldefinition'
import Footer from '@/core/components/footer'
import ToolBox from '@/core/components/toolBox'
import ScrollCtrl from '@/core/components/scroll/scrollCtrl'
import KeyCodes from '@/core/data-models/keyCodes'

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
    lineCount: Number,
    lineFactor: Number,
    lastrefreshRequest: Object
  },
  data () {
    return {
      predefinedlineCount: undefined,
      offsetTop: 0,
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
          name: 'BtnStart',
          event: this.first,
          icon: 'first_page'
        },
        {
          name: 'BtnEnd',
          event: this.last,
          icon: 'last_page'
        },
        {
          name: 'BtnPageUp',
          event: this.prevPage,
          icon: 'chevron_left'
        },
        {
          name: 'BtnPageDown',
          event: this.nextPage,
          icon: 'chevron_right'
        }
      ]
    }
  },
  watch: {
    async lastrefreshRequest () {
      const first = ((this.lastrefreshRequest !== undefined) && (this.lastrefreshRequest.firstPage))
      const last = ((this.lastrefreshRequest !== undefined) && (this.lastrefreshRequest.lastPage) && (!first))
      if ((!last) && (!first)) {
        await this.pgDown(this.curLine.linenumber)
      }
      if (first) await this.first()
      if (last) await this.last()
    }
  },
  computed: {
    computedHeaders () {
      let sortHeader
      let compHeaders = []
      let sortColIncluded = false
      if (this.model.headers !== undefined) {
        if ((this.scrolldefinition.visibleCols === undefined) || (this.scrolldefinition.visibleCols.length === 0)) compHeaders = Object.assign(compHeaders, this.model.headers)
        else {
          let tmpHeadermap = {}
          this.model.headers.forEach((header) => {
            let index = this.scrolldefinition.visibleCols.indexOf(header.value)
            if (index > -1) tmpHeadermap[header.value] = header
            if (header.value === this.model.pagination.sortBy) {
              sortHeader = header
              if (index > -1) sortColIncluded = true
            }
          })
          this.scrolldefinition.visibleCols.forEach((vheader) => {
            let foundHeader = tmpHeadermap[vheader]
            if (foundHeader !== undefined) {
              compHeaders.push(foundHeader)
            }
          })
          if (!sortColIncluded && (sortHeader !== undefined)) compHeaders.unshift(sortHeader)
        }
      }
      return compHeaders
    }
  },
  methods: {
    getHeight () {
      let headerHeight = this.$root.$children[0].$refs.appHeader.getHeight()
      let footerHeight = (this.$refs.dateTableFixedFooter) ? this.$refs.dateTableFixedFooter.getHeight() : 0
      const browserBarHeight = (this.isMobile) ? 50 : 0
      let height = parseInt(headerHeight) + parseInt(footerHeight) + parseInt(browserBarHeight)
      return 'calc(100vh - ' + height + 'px)'
    },
    getMobileStyle (item, header) {
      let calculatedWidth = parseInt(100 / this.computedHeaders.length)
      if (calculatedWidth <= 25) calculatedWidth = 25
      return {
        'border-left': '5px solid #' + item[header.value]['#bg#'],
        width: calculatedWidth + '%',
        padding: '3px',
        overflow: 'hidden'
      }
    },
    onScroll (e) {
      this.offsetTop = e.target.scrollTop
      try {
        this.markDataEndReached()
      } catch {}
    },
    processTapEvent (e, line) {
      let timeout
      const currentTime = new Date().getTime()
      const tapLength = currentTime - this.lastTap
      clearTimeout(timeout)
      if (tapLength < 500 && tapLength > 0 && this.lastTapLine === line) {
        this.handleEvent('BtnEdit', line)
        e.preventDefault()
      } else {
        timeout = setTimeout(function () {
          clearTimeout(timeout)
        }, 500)
      }
      this.lastTap = currentTime
      this.lastTapLine = line
    },
    requestFocus () {
      this.$nextTick(this.$refs.scrollContainer.focus())
      console.log(this.$refs)
      try {
        this.markDataEndReached()
      } catch (error) {
      }
    },
    getHeaderStyle (header) {
      return this.isCurSort(header) ? 'font-weight: bold; color: black; float: left' : 'font-weight: normal; float: left'
    },
    isCurSort (header) {
      return (this.model.pagination.sortBy === header.value)
    },
    openSearch () {
      this.isSearchOpen = true
    },
    closeSearch () {
      this.isSearchOpen = false
      this.requestFocus()
    },
    async saveSearch (line, headerValue, searchValue) {
      this.scrollRequestData.curSort = headerValue
      line[headerValue]['#val#'] = searchValue
      await this.pgDown(line.linenumber)
      this.markDataEndReached()
    },
    async processSwipeEvent (event) {
      if ((this.predefinedlineCount === undefined) || (this.predefinedlineCount === 0)) {
        if (event === 'bottom') await this.pgUp()
        if (event === 'top') await this.pgDown()
      } else {
        if ((!this.loading) && (this.offsetTop < 1) && (event === 'bottom')) this.pgUp()
        if ((!this.loading) && (this.offsetTop > 0) && (event === 'top')) {
          const maxOffset = this.dataTable.scrollHeight - this.$refs.scrollContainer.getBoundingClientRect().height
          if (this.offsetTop >= maxOffset) this.pgDown()
        }
      }
    },
    markDataEndReached () {
      const firstElement = this.$refs['refItem_line_0']
      const lastElement = this.$refs['refItem_line_' + (this.model.lines.length - 1)]
      const lastReached = ((this.model.lastDataReached) && (this.calcLineProperties(this.$refs.scrollContainer, lastElement, true).visible))
      const firstReached = ((this.model.firstDataReached) && (this.calcLineProperties(this.$refs.scrollContainer, firstElement, true).visible))
      this.$refs.dateTableFixedFooter.setFirstDataReached(firstReached)
      this.$refs.dateTableFixedFooter.setLastDataReached(lastReached)
    },
    handleClick (line) {
      if (!this.loading) {
        if (!this.isMultiselect) this.curLine = line
        if (this.isMultiselect) this.curLine = line
      }
    },
    processWheelEvent (e) {
      e.preventDefault()
      if (!this.loading) (window.event.deltaY > 0) ? this.scrollDown() : this.scrollUp()
    },
    getStyle (line, headerValue) {
      let result = {
        'text-align': 'left',
        'white-space': 'nowrap'
      }
      if (this.isMobile) {
        result.height = '150px'
        result['max-height'] = '150px'
        result['border-bottom'] = '0.1px solid grey'
      } else {
        result.height = '50px'
      }
      if (line === this.curLine) {
        result['background-color'] = '#3297FDFF'
        result.color = 'white'
      } else {
        if ((line.linenumber % 2) === 0) result['background-color'] = '#3297FD10'
        if (headerValue !== undefined) {
          let bgColor = line[headerValue]['#bg#']
          let fgColor = line[headerValue]['#fg#']
          if (bgColor !== undefined) result['background-color'] = '#' + bgColor
          if (fgColor !== undefined) result.color = '#' + fgColor
        }
      }
      return result
    },
    translate (untranslated) {
      let result = untranslated
      try {
        result = this.screenmodel.translate(untranslated)
      } catch {}
      return result
    },
    processKeyEvent (event) {
      let used = false
      if (event.keyCode === KeyCodes.VK_F7) { this.changeToNextSort(); used = true }
      if ((event.keyCode === KeyCodes.VK_F) && event.ctrlKey) { this.openSearchBox(); used = true }
      if ((event.keyCode === KeyCodes.VK_ESCAPE) && (this.$route.path !== '/menu')) { this.$router.push('/menu'); used = true }
      if (event.keyCode === KeyCodes.VK_F2) { this.handleEvent('BtnEdit'); used = true }
      if (event.keyCode === KeyCodes.VK_PAGE_DOWN) { this.nextPage(); used = true }
      if (event.keyCode === KeyCodes.VK_PAGE_UP) { this.prevPage(); used = true }
      if (event.keyCode === KeyCodes.VK_HOME) { this.first(); used = true }
      if (event.keyCode === KeyCodes.VK_END) { this.last(); used = true }
      if (event.keyCode === KeyCodes.VK_UP) { this.scrollUp(); used = true }
      if (event.keyCode === KeyCodes.VK_DOWN) { this.scrollDown(); used = true }
      return used
    },
    openSearchBox () {
      let editDlg = this.$refs['editDlg_' + this.curLine.linenumber + '_' + this.scrollRequestData.curSort]
      if (editDlg !== undefined) {
        editDlg[0].isActive = true
        this.isSearchOpen = true
      }
    },
    async scrollUp () {
      if (this.model.lines === undefined) this.first()
      else {
        if (this.model.lines.indexOf(this.curLine, 0) === 0) await this.pgUp()
        else {
          let curLineProps = await this.calcLineProperties(this.$refs.scrollContainer, this.$refs['refItem_line_' + this.curLine.linenumber], true)
          if (curLineProps.visible) {
            this.curLine = this.model.lines[this.model.lines.indexOf(this.curLine, 0) - 1]
            let element = this.$refs['refItem_line_' + this.curLine.linenumber]
            const lineProps = await this.calcLineProperties(this.$refs.scrollContainer, element, true)
            if (!lineProps.visible) this.dataTable.scrollTop = lineProps.reqFirstLineOffset
          } else {
            this.dataTable.scrollTop = curLineProps.reqFirstLineOffset
          }
        }
      }
    },
    async scrollDown () {
      if (this.model.lines === undefined) this.first()
      else {
        let lastvisibleLineNr = this.calcLastVisibleLineIndex()
        if (this.curLine.linenumber === lastvisibleLineNr) await this.pgDown(lastvisibleLineNr)
        else {
          let curLineProps = await this.calcLineProperties(this.$refs.scrollContainer, this.$refs['refItem_line_' + this.curLine.linenumber], true)
          if (curLineProps.visible) {
            this.curLine = this.model.lines[this.model.lines.indexOf(this.curLine, 0) + 1]
            let element = this.$refs['refItem_line_' + this.curLine.linenumber]
            const lineProps = await this.calcLineProperties(this.$refs.scrollContainer, element, true)
            if (!lineProps.visible) this.dataTable.scrollTop = lineProps.reqLastLineOffset
          } else {
            this.dataTable.scrollTop = curLineProps.reqLastLineOffset
          }
        }
      }
    },
    calcLineOffsetAndHeight (element) {
      const result = { offset: 0, height: 0 }
      if (!this.isMobile) {
        if ((element[0] !== undefined) && (element[0].offsetTop !== undefined)) {
          result.offset = element[0].offsetTop
          result.height = element[0].getBoundingClientRect().height
        } else {
          if (element.offsetTop !== undefined) {
            result.offset = element.offsetTop
            result.height = element.getBoundingClientRect().height
          }
        }
      } else {
        if ((element[0] !== undefined) && (element[0].offsetParten !== undefined) && (element[0].offsetParten.offsetTop !== undefined)) {
          result.offset = element.offsetParten.offsetTop
          result.height = element.getBoundingClientRect().height
        } else {
          if (element.offsetTop !== undefined) {
            result.offset = element.offsetTop
            result.height = element.getBoundingClientRect().height
          }
        }
      }
      return result
    },
    calcLineProperties (viewport, element, fullheight) {
      let result = { visible: false, offset: 0, height: 0, isFirstInViewPort: false, isLastInViewPort: false, reqFirstLineOffset: 0, reqLastLineOffset: 0 }
      let fixedHeader = this.$refs.dataTableFixedHeader
      let fixedHeaderHeight = (fixedHeader === undefined) ? 0 : fixedHeader.getBoundingClientRect().height
      let fixedFooter = this.$refs.dateTableFixedFooter
      let fixedFooterHeight = (fixedFooter === undefined) ? 0 : fixedFooter.getHeight()
      let headerHeight = (this.isMobile) ? 0 : fixedHeaderHeight
      const rect = viewport.getBoundingClientRect()
      let minOffset = headerHeight + this.offsetTop
      const maxOffset = window.innerHeight - fixedFooterHeight - rect.top + this.offsetTop
      const lineOffsetAndHeight = this.calcLineOffsetAndHeight(element)
      result.offset = lineOffsetAndHeight.offset
      result.height = lineOffsetAndHeight.height
      const prevReqMaxOffset = lineOffsetAndHeight.offset
      const nextReqMaxOffset = lineOffsetAndHeight.offset + lineOffsetAndHeight.height + lineOffsetAndHeight.height
      const reqMaxOffset = lineOffsetAndHeight.offset + lineOffsetAndHeight.height
      const prevReqMinOffset = lineOffsetAndHeight.offset - lineOffsetAndHeight.height
      const nextReqMinOffset = lineOffsetAndHeight.offset + lineOffsetAndHeight.height
      const reqMinOffset = lineOffsetAndHeight.offset
      const prevLineIsVisible = ((prevReqMinOffset >= minOffset) && (maxOffset >= (prevReqMaxOffset)))
      const nextLineIsVisible = ((nextReqMinOffset >= minOffset) && (maxOffset >= (nextReqMaxOffset)))
      const fullheightResult = ((reqMinOffset >= minOffset) && (maxOffset >= (reqMaxOffset)))
      const partialResult = (((reqMaxOffset > minOffset) && (reqMinOffset < maxOffset)))
      result.visible = fullheight ? fullheightResult : partialResult
      result.isFirstInViewPort = (fullheightResult && (!prevLineIsVisible))
      result.isLastInViewPort = (fullheightResult && (!nextLineIsVisible))
      result.reqFirstLineOffset = reqMinOffset - headerHeight
      result.reqLastLineOffset = reqMinOffset - (maxOffset - (this.offsetTop + lineOffsetAndHeight.height + 1))
      return result
    },
    calcLastVisibleLineIndex () {
      let lastvisible = -1
      if ((this.predefinedlineCount !== undefined) || (this.predefinedlineCount > 0)) {
        lastvisible = this.model.lines.length - 1
      } else {
        this.calcLineCount()
        let linecounter = this.model.lines.length - 1
        while ((linecounter >= 0) && (lastvisible < 0)) {
          let line = this.model.lines[linecounter]
          let curLine = this.$refs['refItem_line_' + line.linenumber]
          if (curLine !== undefined) {
            const visible = this.calcLineProperties(this.$refs.scrollContainer, curLine, true).visible
            if (visible) lastvisible = line.linenumber
            linecounter--
          }
        }
      }
      return lastvisible
    },
    async help () {
      alert('Help not yet implemented!')
    },
    async pgUp () {
      if (this.model.firstDataReached) {
        await this.first()
      } else {
        this.loading = true
        let startLine
        try {
          startLine = this.model.lines[0]
        } catch {}
        const scrollRequest = this.generateScrollRequest(false)
        this.model = await this.scrollCtrl.getScrollModel(this.mandCtxt, scrollRequest, this.screenmodel, startLine)
        this.curLine = (undefined !== this.model.lines) ? this.model.lines[this.model.lines.length - 1] : undefined
        this.loading = false
        this.$nextTick(function () { this.dataTable.scrollTop = Number.MAX_SAFE_INTEGER })
        this.requestFocus()
      }
    },
    nextPage () {
      const nextStartingPosition = this.getCachedStartingLine(true)
      if (nextStartingPosition === undefined) {
        this.pgDown()
      } else {
        this.curLine = nextStartingPosition.startingLine
        this.dataTable.scrollTop = nextStartingPosition.lineProperties.reqFirstLineOffset
        this.requestFocus()
      }
    },
    async prevPage () {
      if ((undefined !== this.model.lines) && (this.model.lines.indexOf(this.curLine, 0) === 0)) await this.pgUp()
      else {
        const prevStartingPosition = this.getCachedStartingLine(false)
        if (prevStartingPosition === undefined) {
          this.pgUp()
        } else {
          this.curLine = prevStartingPosition.startingLine
          this.dataTable.scrollTop = prevStartingPosition.lineProperties.reqFirstLineOffset
          this.requestFocus()
        }
      }
    },
    getCachedStartingLine (forward) {
      let linenumber = this.curLine.linenumber
      let result
      if ((this.lineFactor !== undefined) || (this.lineCount !== undefined)) {
        const firstVisibleLinenumber = this.findFirstVisibleLineNumber(linenumber)
        const lastVisibleLinenumber = this.findLastVisibleLineNumber(linenumber)
        const totalVisibleLines = (lastVisibleLinenumber - firstVisibleLinenumber) + 1
        const nextStartingLineNumber = (totalVisibleLines < 1) ? linenumber : (forward) ? lastVisibleLinenumber : (firstVisibleLinenumber - (totalVisibleLines - 1))
        const nextEndingLineNumber = (totalVisibleLines < 1) ? linenumber : (forward) ? lastVisibleLinenumber + (totalVisibleLines - 1) : (firstVisibleLinenumber)
        const startingLineRef = this.$refs['refItem_line_' + nextStartingLineNumber]
        const endingLineRef = this.$refs['refItem_line_' + nextEndingLineNumber]
        if ((startingLineRef !== undefined) && (endingLineRef !== undefined)) {
          const nextProps = this.calcLineProperties(this.$refs.scrollContainer, startingLineRef, true)
          let line = (forward) ? this.model.lines[nextStartingLineNumber] : this.model.lines[nextEndingLineNumber]
          result = { startingLine: line, lineProperties: nextProps }
        }
      }
      return result
    },
    findFirstVisibleLineNumber (linenumber) {
      let firstVisibleLinenumber = linenumber
      let curLineIsVisible = true
      while (curLineIsVisible) {
        let currentLine = this.$refs['refItem_line_' + firstVisibleLinenumber]
        curLineIsVisible = (currentLine === undefined) ? false : this.calcLineProperties(this.$refs.scrollContainer, currentLine, true).visible
        if (curLineIsVisible) firstVisibleLinenumber--
      }
      firstVisibleLinenumber++
      return firstVisibleLinenumber
    },
    findLastVisibleLineNumber (linenumber) {
      let lastVisibleLinenumber = linenumber
      let curLineIsVisible = true
      while (curLineIsVisible) {
        let currentLine = this.$refs['refItem_line_' + lastVisibleLinenumber]
        curLineIsVisible = (currentLine === undefined) ? false : this.calcLineProperties(this.$refs.scrollContainer, currentLine, true).visible
        if (curLineIsVisible) lastVisibleLinenumber++
      }
      lastVisibleLinenumber--
      return lastVisibleLinenumber
    },
    async pgDown (curLineIndex) {
      this.loading = true
      let lastLineIndex
      let lastLine
      try {
        lastLineIndex = ((curLineIndex === undefined) || (typeof curLineIndex !== 'number')) ? this.calcLastVisibleLineIndex() : curLineIndex
        lastLine = this.model.lines[lastLineIndex]
      } catch {}
      const scrollRequest = this.generateScrollRequest(true)
      this.model = await this.scrollCtrl.getScrollModel(this.mandCtxt, scrollRequest, this.screenmodel, lastLine)
      this.curLine = (undefined !== this.model.lines) ? this.model.lines[0] : undefined
      this.loading = false
      this.dataTable.scrollTop = 0
      this.requestFocus()
    },
    async first () {
      this.loading = true
      const scrollRequest = this.generateScrollRequest(true)
      this.model = await this.scrollCtrl.getScrollModel(this.mandCtxt, scrollRequest, this.screenmodel)
      this.curLine = (undefined !== this.model.lines) ? this.model.lines[0] : undefined
      this.loading = false
      this.dataTable.scrollTop = 0
      this.requestFocus()
    },
    async last () {
      this.loading = true
      const scrollRequest = this.generateScrollRequest(false)
      this.model = await this.scrollCtrl.getScrollModel(this.mandCtxt, scrollRequest, this.screenmodel)
      this.curLine = (undefined !== this.model.lines) ? this.model.lines[this.model.lines.length - 1] : undefined
      this.loading = false
      this.dataTable.scrollTop = Number.MAX_SAFE_INTEGER
      this.requestFocus()
    },
    generateScrollRequest (forward) {
      const refreshedAppfilter = this.refreshAppfilter(this)
      if (refreshedAppfilter !== undefined) this.scrollRequestData.appfilter = refreshedAppfilter
      return {
        scrollBO: this.scrollRequestData.scrollBO,
        appfilter: this.scrollRequestData.appfilter,
        scrollID: this.scrollRequestData.scrollID,
        rows: ((this.predefinedlineCount !== undefined) && (this.predefinedlineCount > 0) ? this.predefinedlineCount : this.calcLineCount()),
        direction: forward,
        sort: this.scrollRequestData.curSort
      }
    },
    refreshAppfilter () {

    },
    calcLineCount () {
      let headerHeight = (this.isMobile) ? 50 : 75
      let footerHeight = (this.isMobile) ? 50 : 100
      this.scrollheight = (window.innerHeight - footerHeight - headerHeight)
      if (!this.isMobile) this.scrollheight -= this.scrollHeaderHeight
      this.defaultLineheight = (this.isMobile ? 100 : 50)
      let lines = parseInt((this.scrollheight / this.defaultLineheight))
      if (this.lineFactor !== undefined) {
        try {
          lines = parseInt((lines * this.lineFactor))
          this.predefinedlineCount = lines
        } catch {}
      }
      return lines
    },
    handleToolBoxEvent (event) {
      this.isToolBoxOpen = false
      if (event !== 'Abort') this.handleEvent('toolBoxEvent', event)
    },
    handleKeyEvent (event) {
      this.handleEvent('keyEvent', event)
    },
    handleEvent (actionCommand, event) {
      if ((!this.isSearchOpen) && (!this.isToolBoxOpen) && (!this.loading)) {
        if (actionCommand === 'toolBoxEvent') this.$emit('handleEvent', actionCommand, event, this.curLine)
        if ((actionCommand === 'keyEvent') && (!this.processKeyEvent(event))) this.$emit('handleEvent', actionCommand, event, this.curLine)
        if (((this.extendedscrollactionsIDs.indexOf(actionCommand) > -1) && (actionCommand !== 'keyEvent'))) this.$emit('handleEvent', actionCommand, event, this.curLine)
      }
    },
    onResize () {
      if (this.scrollRequestData.mobileSupported && (window.innerWidth < 750)) this.isMobile = true
      else this.isMobile = false
    },
    changeToNextSort () {
      let curSort = this.model.pagination.sortBy
      let sortable = Object.values(this.model.sortable)
      let index = sortable.indexOf(curSort)
      let newSort
      while (newSort === undefined) {
        index = ((index + 1) < sortable.length) ? index + 1 : 0
        let tmpSort = sortable[index]
        if (tmpSort !== undefined) {
          if ((undefined !== this.scrolldefinition.visibleCols) && (this.scrolldefinition.visibleCols.indexOf(tmpSort) > -1)) newSort = tmpSort
          if (undefined === this.scrolldefinition.visibleCols) newSort = tmpSort
        }
      }
      this.changeSort(newSort)
    },
    async changeSort (newSort) {
      this.loading = true
      if (this.model.sortable[newSort] !== undefined) {
        if (this.model.pagination.sortBy !== newSort) {
          this.scrollRequestData.curSort = newSort
          await this.pgDown(this.curLine.linenumber)
        }
      }
      this.loading = false
    },
    openToolBox () {
      this.isToolBoxOpen = true
    },
    async selectInitialRow () {
      const scrollConfig = this.lastrefreshRequest.scrollConfig
      if ((this.curLine !== undefined) && (scrollConfig !== undefined)) {
        const lineNumber = scrollConfig.lineNumber
        const toolID = scrollConfig.toolID
        if (lineNumber !== '') this.curLine = ((undefined !== this.model.lines[lineNumber]) && (toolID === this.model.lines[lineNumber].DFRECNUM['#val#'].toString())) ? this.model.lines[lineNumber] : this.curLine
        let curLineProps = await this.calcLineProperties(this.$refs.scrollContainer, this.$refs['refItem_line_' + this.curLine.linenumber], true)
        if (!curLineProps.visible) this.dataTable.scrollTop = curLineProps.reqFirstLineOffset
      }
    }
  },
  async beforeMount () {
    if (this.lineCount !== undefined) this.predefinedlineCount = this.lineCount
    this.scrollCtrl = new ScrollCtrl(this.$api)
    this.mandCtxt = this.$store.getters['ctxtStore/get']
    this.scrollRequestData.scrollBO = this.scrolldefinition.scrollBO
    this.scrollRequestData.scrollID = this.scrolldefinition.scrollID
    this.scrollRequestData.appfilter = this.scrolldefinition.appfilter
    this.scrollRequestData.curSort = this.scrolldefinition.curSort
    if (undefined !== this.scrolldefinition.mobileSupported) this.scrollRequestData.mobileSupported = this.scrolldefinition.mobileSupported
    if (undefined !== this.scrolldefinition.searchSupported) this.scrollRequestData.searchSupported = this.scrolldefinition.searchSupported
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
      await this.selectInitialRow()
    } catch {}
    this.loading = false
  },
  async mounted () {
    let dataTable = this.$refs.dataTable
    if (dataTable !== undefined) {
      let dt = dataTable.$el.querySelector('.v-data-table__wrapper')
      dt.addEventListener('scroll', this.onScroll)
      this.dataTable = dt
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 750px) {
    .mobile table.v-table tr {
      max-width: 100%;
      position: relative;
      display: block
    }

    .mobile table.v-table tr td {
      display: flex;
      width: 100%
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
  background: transparent
}

.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  overflow: hidden;
  align-items: flex-start
}
</style>
