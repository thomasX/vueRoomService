const passport = require('passport')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const config = require('./config')
const db = require('../models/index')
const UserBO = require('../BO/UserBO')

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.authentication.jwtSecret
  }, async function (jwtPayload, done) {
    try {
      const bokey = { id: jwtPayload.id }
      const bo = new UserBO(db, bokey)
      const dto = await bo.getDTO()
      if (!dto) {
        return done(new Error(), false)
      }
      return done(null, dto)
    } catch (err) {
      return done(new Error(), false)
    }
  })
)

module.exports = null
