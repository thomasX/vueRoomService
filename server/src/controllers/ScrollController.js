const AbstractScrollBO = require('../ScrollBO/AbstractScrollBO')
const ScrollBoFactory = require('../ScrollBO/ScrollBoFactory')

const { User } = require('../models')

module.exports = {
  async getScrollModel (req, res) {
    const { email, scrollrequest } = req.body
    let result = null
    let status = 200
    console.log('###############################' + email + ' ' + JSON.stringify(req.body))
    try {
      const user = await User.findOne({
        where: {
          email: email
        }
      })
      console.log('nsch sear ')
      const scrollBO = ScrollBoFactory.createInstance(scrollrequest.scrollBO)
      const abstractScrollBO = new AbstractScrollBO(this.db)
      result = abstractScrollBO.getScrollModel(scrollBO, scrollrequest, user)
    } catch (error) {
      console.log(req.body)
      result = 'error:' + error
      status = 500
    }
    res.status(status).send(result)
  }
}
