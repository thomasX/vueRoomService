const AbstractScrollBO = require('../ScrollBO/AbstractScrollBO')
const ScrollBoFactory = require('../ScrollBO/ScrollBoFactory')

// const { User } = require('../models')
module.exports = async (db) => {
  getScrollModel (req, res) {
    const { email, scrollrequest } = req.body
    const user = await db.models.User.findOne({
      where: {
        email: email
      }
    })
    const scrollBO = ScrollBoFactory.createInstance(scrollrequest.scrollBO)
    const abstractScrollBO = new AbstractScrollBO(db)
    const result = abstractScrollBO.getScrollModel(scrollBO, scrollrequest, user)
    return result
  }
}
