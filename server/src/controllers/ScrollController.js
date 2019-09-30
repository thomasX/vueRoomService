const AbstractScrollBO = require('../ScrollBO/AbstractScrollBO')
const ScrollBoFactory = require('../ScrollBO/ScrollBoFactory')

const { User } = require('../models')

module.exports = {
  async getScrollModel (req, res) {
    console.log('hhh####################################################################')
    const email = req.query.email
    const scrollrequest = req.query.scrollRequest
    const body = req.body
    console.log('  ################ body:')
    console.log(body)
    let status = 200
    let result
    console.log('###############################email und body ' + email + ' ' + scrollrequest
    )
    try {
      const user = await User.findOne({
        where: {
          email: email
        }
      })
      console.log('#######' + JSON.stringify(user) + 'scrollBO ' + scrollrequest.scrollBO)
      const scrollBO = new ScrollBoFactory().createInstance(scrollrequest.scrollBO)
      console.log('########### result' + scrollBO + '   ' + scrollrequest.scrollBO)
      const abstractScrollBO = new AbstractScrollBO(this.db)
      result = abstractScrollBO.getScrollModel(scrollBO, scrollrequest, user)
      console.log(result)
    } catch (error) {
      console.log(req.body)
      result = 'error:' + error
      status = 500
    }
    res.status(status).send(result)
  }
}
