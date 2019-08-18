import Api from '@/services/Api'
import Screenmodel from '@/core/data-models/screenmodel'


export default {
  async getScreenmodel (screenId, language) {
    try {
      const screenmodelResponse = await Api().get(`Screenmodel/${screenId}/${language}`)
      return new Screenmodel(screenId, screenmodelResponse.data)
    } catch {
      return new Screenmodel(screenId)
    }
  }

}