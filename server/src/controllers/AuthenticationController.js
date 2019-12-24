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
      const user = await db['User'].create(req.body)
      res.send({
        user: JSON.stringify(user),
        token: jwtSignUser(user.email)
      })
    } catch (err) {
      res.status(400).send({
        error: 'This email account is already in use.'
      })
    }
  },
  async login (req, res) {
    const { email, password } = req.body
    console.log('email: ' + email)
    console.log('passwd: ' + password)
    const userGBO = new UserGBO(db)
    const dto = await userGBO.login(email, password)
    // delete dto.password
    const token = jwtSignUser(dto)
    console.log('token: ' + JSON.stringify(token))
    const result = { user: dto.email, token: token }
    res.send(result)
  },
  async activeAdminUserExists (req, res) {
    try {
      const user = await db['User'].findOne({
        where: {
          admin: true
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
