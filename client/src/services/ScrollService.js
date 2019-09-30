import Api from '@/services/Api'
import ScrollModel from '@/core/data-models/scrollmodel'

export default {

  async getScrollModel (userCtxt, scrollRequest, screenmodel, startLine) {
    try {
      const params = {
        email: userCtxt.email,
        scrollRequest: scrollRequest
      }      
      alert('################### params')
      alert(JSON.stringify(params))
      if (startLine !== undefined) params.scrollRequest.start = startLine
      const scrollResponse = await new Api().put('/Scroll/ScrollModel', params )
      alert('response:' + JSON.stringify(scrollResponse))
      return new ScrollModel(scrollResponse, screenmodel)
    } catch (error) {
      alert('error ################:' + JSON.stringify(error));
    }
  }

}