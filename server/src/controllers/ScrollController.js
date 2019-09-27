const AbstractScrollBO = require('../ScrollBO/AbstractScrollBO')
const ScrollBoFactory = require('../ScrollBO/ScrollBoFactory')

const { User } = require('../models')

module.exports = {
  async getScrollModel (req, res) {
    const email = req.query.email
    const scrollrequest = req.query.scrollRequest
    let status = 200
    let result
    console.log('###############################email und body ' + email + ' ' + scrollrequest)
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
