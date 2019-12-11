import ScrollService from '@/services/ScrollService'
export default class scrollCtrl {
  constructor (api) {
    this.api = api
  }
  async getScrollModel (userCtxt, scrollRequest, screenmodel, startLine) {
    let result = undefined
    console.log('userCtxt: ' + JSON.stringify(userCtxt))
    console.log('scrollRequest: ' + JSON.stringify(scrollRequest))
    console.log('screenmodel: ' + JSON.stringify(screenmodel))
    console.log('startLine: ' + JSON.stringify(startLine))
    try {
      result = await ScrollService.getScrollModel(userCtxt, scrollRequest, screenmodel, startLine)
    } catch (error) {
      alert(error)
    }
    console.log(result)
    return result
  }
  async saveScrollConfig (mandCtxt, id, computedHeaders) {
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
    console.log('saveScrollConfigNotSupported')
  }
}
