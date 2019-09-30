const AbstractScrollBO = require('../ScrollBO/AbstractScrollBO')
const ScrollBoFactory = require('../ScrollBO/ScrollBoFactory')
const db = require('../models/index')
// const { User } = require('../models')

module.exports = {
  async getScrollModel (req, res, app) {
    const body = req.body
    let status = 200
    let result

    try {
      const user = await db['User'].findOne({
        where: {
          email: body.email
        }
      })
      const scrollBO = new ScrollBoFactory().createInstance(body.scrollRequest.scrollBO, body.scrollRequest.sort)
      const abstractScrollBO = new AbstractScrollBO(db)
      result = await abstractScrollBO.getScrollModel(scrollBO, body.scrollRequest, user)
      console.log('########### RESULT: ' + JSON.stringify(result))
    } catch (error) {
      result = 'error:' + error
      status = 500
    }
    console.log('status' + status + '   result:' + JSON.stringify(result))
    res.status(status).send(result)
  }
}
