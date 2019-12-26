const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const UserGBO = require('../BO/UserGBO')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  const token = jwt.sign({ email: user.email, exp: ONE_WEEK }, config.authentication.jwtSecret)
  return token
}

module.exports = {
  async register (req, res) {
    try {
      const dto = req.body
      const gbo = new UserGBO(db)
      await gbo.createUser(dto)
      res.send({
        email: dto.email
      })
    } catch (err) {
      res.status(400).send({
        error: 'This email account is already in use.'
      })
    }
  },
  async login (req, res) {
    const { email, password } = req.body
    const userGBO = new UserGBO(db)
    const userPair = await userGBO.login(email, password)
    const bokey = userPair.key
    const dto = userPair.value
    delete dto.password
    dto.id = bokey.id
    const token = jwtSignUser(dto)
    const result = { user: dto, token: token }
    res.send(result)
  },
  async activeAdminUserExists (req, res) {
    try {
      const gbo = new UserGBO(db)
      const result = await gbo.activeAdminUserExists()
      if (result === true) {
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
