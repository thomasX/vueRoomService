import ScrollService from '@/services/ScrollService'
export default class scrollCtrl {
  constructor (api) {
    this.api = api
  }
  async getScrollModel (userCtxt, scrollRequest, screenmodel, startLine) {
    let result = undefined
    try {
      result = await ScrollService.getScrollModel(userCtxt, scrollRequest, screenmodel, startLine)
    } catch (error) {
      alert(error)
    }
    console.log(JSON.stringify(result))
    return result
  }
}
