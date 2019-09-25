const AbstractScrollBO = require('../ScrollBO/AbstractScrollBO')
const ScrollBoFactory = require('../ScrollBO/ScrollBoFactory')

const { User } = require('../models')

module.exports = {
  async getScrollModel (req, res) {
    const { email, scrollrequest } = req.body
    let result = null
    try {
      const user = await User.findOne({
        where: {
          email: email
        }
      })
      const scrollBO = ScrollBoFactory.createInstance(scrollrequest.scrollBO)
      const abstractScrollBO = new AbstractScrollBO(this.db)
      result = abstractScrollBO.getScrollModel(scrollBO, scrollrequest, user)
    } catch (error) {
      console.log(req)
      res.status(500).send('error:' + error)
    }
    res.send(result)
  }
}
