import ScrollService from '@/services/ScrollService'
export default class scrollCtrl {
  constructor (api) {
    this.api = api
  }
  async getScrollModel (userCtxt, scrollRequest, screenmodel, startLine) {
    console.log('jetzt wird ein scrollmodel angeforder: ')
    console.log(userCtxt) ... da liegt der fehler
    console.log(scrollRequest)
    console.log(screenmodel)
    console.log(startLine)
    const aaa = ScrollService.testmethod()
    console.log(aaa)
    const result = await ScrollService.getScrollModel(userCtxt, scrollRequest, screenmodel, startLine)
    console.log(result)
    console.log('scrollresult')
    return result
  }
}
