const { User } = require('../models')
const abstrScrollBO = require('../BO/AbstrScrollBO')
module.exports = {
  async getScrollModel (req, res) {
    const { email, scrollrequest } = req.body
    const user = await User.findOne({
      where: {
        email: email
      }
    })
    const scrollboname = req.params.scrollBO
    const scrollBO = abstrScrollBO.createInstance(scrollboname)
    const result = scrollBO.getScrollModel(scrollrequest, user)
    return result
  }
}
