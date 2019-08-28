import AbstractScrollBO from './BO/AbstractScrollBO'

const { User } = require('../models')
const scrollBoFactory = require('../BO/ScrollBoFactory')
module.exports = {
  async getScrollModel (req, res) {
    const { email, scrollrequest } = req.body
    const user = await User.findOne({
      where: {
        email: email
      }
    })
    const scrollBO = scrollBoFactory.createInstance(scrollrequest.scrollBO)
    const abstractScrollBO = new AbstractScrollBO(scrollBO)
    const result = abstractScrollBO.getScrollModel(scrollrequest, user)
    return result
  }
}
