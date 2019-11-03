const { User } = require('../models')

module.exports = {
  async getUser (req, res) {
    try {
      const { id } = req.body
      const user = await User.findOne({
        where: {
          id: id
        }
      })
      if ((user) && (user !== null)) {
        res.send(true)
      } else {
        res.send(false)
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}
