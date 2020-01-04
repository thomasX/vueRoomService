import Api from '@/services/Api'
import ScrollModel from '@/core/data-models/scrollmodel'

export default {

  async getScrollModel (store, userCtxt, scrollRequest, screenmodel, startLine) {
    try {
      const params = {
        email: userCtxt.email,
        scrollRequest: scrollRequest
      }      
      if (startLine !== undefined) params.scrollRequest.start = startLine
      const scrollResponse = await new Api(store).putAuthorized('api/scroll/ScrollModel',undefined, params )
      const result = new ScrollModel(scrollResponse, screenmodel)
      return result
    } catch (error) {
      console.warn('error ################:' + JSON.stringify(error))
    }
  }

}