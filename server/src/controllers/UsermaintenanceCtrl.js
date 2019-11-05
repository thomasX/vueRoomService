const { User } = require('../models')

module.exports = {
  async getUser (req, res) {
    try {
      const id = req.params.id
      const user = await User.findOne({
        where: {
          id: id
        }
      })
      if ((user) && (user !== null)) {
        const userJSON = user.toJSON()
        res.send(userJSON)
      } else {
        throw new TypeError('undefined User')
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}
