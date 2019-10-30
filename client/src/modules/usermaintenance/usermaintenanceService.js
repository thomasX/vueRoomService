import Api from '@/services/Api'
import Screenmodel from '@/core/data-models/screenmodel'


export default {
  async getScreenmodel (screenId, language) {
    try {
      const withTranslations = process.env.VUE_APP_ROOMSERVICE_TRANSLATION_ACTIV
      let screenmodelResponse ={data: ''}
      if (withTranslations === true) {
        screenmodelResponse = await new Api().get(`Screenmodel/${screenId}/${language}`)
      }
      return new Screenmodel(screenId, screenmodelResponse.data)
    } catch {
      return new Screenmodel(screenId)
    }
  }

}