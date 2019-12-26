const db = require('../models/index')
const UserBO = require('../BO/UserBO')
const UserGBO = require('../BO/UserGBO')

module.exports = {
  async getUser (req, res) {
    try {
      const id = req.params.id
      const bo = new UserBO(db, { id: id })
      const result = await bo.getDTO()
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
      // const bokey = req.body.bokey
      console.log('######## kkkkk: schchchchchc ')
      console.log('######## kkkkk: ' + JSON.stringify(req.body))
      const dto = req.body.dto
      const gbo = new UserGBO(db)
      await gbo.createUser(dto)
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
      console.log('####### req.body ###########' + JSON.stringify(req.body))
      const bokey = req.body.bokey
      const dto = req.body.dto
      const bo = new UserBO(db, bokey)
      await bo.setDTO(dto)
      res.send({
        updated: true
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'This email account doesnot exist'
      })
    }
  }
}
