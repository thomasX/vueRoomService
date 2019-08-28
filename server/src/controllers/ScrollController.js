import AbstractScrollBO from '../ScrollBO/AbstractScrollBO'
import ScrollBoFactory from '../ScrollBO/ScrollBoFactory'

const { User } = require('../models')

export default class ScrollController {
  async getScrollModel (req, res) {
    const { email, scrollrequest } = req.body
    const user = await User.findOne({
      where: {
        email: email
      }
    })
    const scrollBO = ScrollBoFactory.createInstance(scrollrequest.scrollBO)
    const result = AbstractScrollBO.getScrollModel(scrollBO, scrollrequest, user)
    return result
  }
}
