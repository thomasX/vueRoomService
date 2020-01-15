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
        throw new Error('undefined User')
      }
    } catch (err) {
      res.status(500).send('error reading user :' + err)
    }
  },
  async createUser (req, res) {
    try {
      // const user =
      // const bokey = req.body.bokey
      const dto = req.body.dto
      const gbo = new UserGBO(db)
      await gbo.createUser(dto)
      const userJson = JSON.stringify(dto)
      res.send({
        user: userJson,
        created: true
      })
    } catch (err) {
      res.status(400).send('error creating user :' + err)
    }
  },
  async updateUser (req, res) {
    try {
      console.log('############UUUUUUUU# req.body')
      console.log('############UUUUUUUU# req.body' + JSON.stringify(req.body))
      const bokey = req.body.bokey
      const dto = req.body.dto

      const bo = new UserBO(db, bokey)
      await bo.setDTO(dto)
      const userJson = JSON.stringify(dto)
      res.send({
        user: userJson,
        updated: true
      })
    } catch (err) {
      res.status(400).send('error updating user :' + err)
    }
  }
}
