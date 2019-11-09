import Screenmodel from '@/core/data-models/screenmodel'
export default class ScrollModel {
  constructor (rawdata, screenmodel) {
    const result = rawdata.data
    this.screenID = result.scrollModel.CurScreenID
    this.lines = result.scrollModel.CurScrollDTO.LineCollection
    this.orgHeaders = result.scrollModel.CurScrollDTO.NameCollection
    this.scrollBO = result.scrollboClassName
    this.sortable = result.scrollModel.CurSortCol
    this.lastDataReached = result.scrollModel.CurScrollDTO.lastDataReached
    this.firstDataReached = result.scrollModel.CurScrollDTO.firstDataReached
    this.pagination = {
      sortBy: result.scrollModel.CurSort
    }
    this.generateHeaders(screenmodel)
    let counter = 0
    if (this.lines !== undefined) {
      this.lines.forEach(line => {
        line.linenumber = counter++
      })
    }
    console.log(JSON.stringify(this))
  }

  generateHeaders (screenmodel) {
    let sm = screenmodel
    try {
      sm.translate('test')
    } catch {
      sm = new Screenmodel('undefined')
    }
    let hCol = []
    this.orgHeaders.forEach(element => {
      let nElement = {
        text: sm.translate(element),
        value: element,
        sortable: false,
        searchable: (this.sortable[element] !== undefined)
      }
      hCol.push(nElement)
    })
    this.headers = hCol
  }
}
