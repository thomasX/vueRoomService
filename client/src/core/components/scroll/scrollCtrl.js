import ScrollService from '@/services/ScrollService'
export default class scrollCtrl {
  constructor (api) {
    this.api = api
  }
  async getScrollModel (userCtxt, scrollRequest, screenmodel, startLine) {
    const result = await new ScrollService().getScrollModel(userCtxt, scrollRequest, screenmodel, startLine)
    return result
  }
}
