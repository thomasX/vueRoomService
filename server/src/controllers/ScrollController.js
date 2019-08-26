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
    const scrollboname = req.params.scrollBO
    const scrollBO = scrollBoFactory.createInstance(scrollboname)
    const result = scrollBO.getScrollModel(scrollrequest, user)
    return result
  }
}
