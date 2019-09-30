import ScrollService from '@/services/ScrollService'
export default class scrollCtrl {
  constructor (api) {
    this.api = api
  }
  async getScrollModel (userCtxt, scrollRequest, screenmodel, startLine) {
    console.log('jetzt wird ein scrollmodel angeforder: ')
    console.log(userCtxt)
    console.log(scrollRequest)
    console.log(screenmodel)
    console.log(startLine)
    let result = undefined
    try {
      result = await ScrollService.getScrollModel(userCtxt, scrollRequest, screenmodel, startLine)
      console.log('response: ' + JSON.stringify(result))
    } catch (error) {
      alert(error)
    }
    return result
  }
}
