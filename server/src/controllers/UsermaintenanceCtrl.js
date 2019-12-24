const db = require('../models/index')
const UserBO = require('../BO/UserBO')

module.exports = {
  async getUser (req, res) {
    try {
      const id = req.params.id
      const bo = new UserBO({ id: id })
      const result = bo.getDTO()
      if ((result) && (result !== null)) {
        const userJSON = JSON.stringify(result)
        res.send(userJSON)
      } else {
        throw new TypeError('undefined User')
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to log in ' + err
      })
    }
  },
  async createUser (req, res) {
    try {
      // const user =
      await db['User'].create(req.body)
      // const userJson = user.toJSON()
      res.send({
        // user: userJson,
        created: true
      })
    } catch (err) {
      res.status(400).send({
        error: 'This email account is already in use.'
      })
    }
  },
  async updateUser (req, res) {
    try {
      // console.log('####### req.body ###########')
      const user = req.body
      // console.log(JSON.stringify(user))
      console.log('##################req.body')
      // const updatedUser =
      await db['User'].update(user, { where: { id: user.id } })
      // const userJson = updatedUser.toJSON()
      res.send({
        // user: userJson,
        updated: true
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'This email accound doesnot exist'
      })
    }
  }
}
