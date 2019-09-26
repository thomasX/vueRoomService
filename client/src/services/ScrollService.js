import Api from '@/services/Api'
import ScrollModel from '@/core/data-models/scrollmodel'

export default {

  async getScrollModel (userCtxt, scrollRequest, screenmodel, startLine) {
    try {
      const config = {
      }
      const params = {
          email: userCtxt.email,
          scrollRequest: scrollRequest
      }      
      config.params = params
      if (startLine !== undefined) params.scrollRequest.start = startLine
      const scrollResponse = await Api().get('/Scroll/getScrollModel',config)
      console.log(scrollResponse)
      return new ScrollModel(scrollResponse, screenmodel)
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }

}