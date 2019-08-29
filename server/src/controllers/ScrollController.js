const AbstractScrollBO = require('../ScrollBO/AbstractScrollBO')
const ScrollBoFactory = require('../ScrollBO/ScrollBoFactory')

const { User } = require('../models')

module.exports = {
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
