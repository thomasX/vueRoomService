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
    return result
  }
  async saveScrollConfig () {
  // async saveScrollConfig (mandCtxt, id, computedHeaders) {
    // let configCol = []
    // computedHeaders.forEach(header => {
    //   configCol.push(header.value)
    // })
    // const params = {
    //   mandant: mandCtxt.mandantenID,
    //   mail: mandCtxt.email,
    //   toolID: mandCtxt.curToolID,
    //   scrollID: id,
    //   configColJson: JSON.stringify(configCol)
    // }
    // await this.api.putAuthorized('keycloak/vue/scroll/saveUserScrollConfig', params)
    alert('saveScrollConfigNotSupported')
  }
}
