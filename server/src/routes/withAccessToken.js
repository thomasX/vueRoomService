const jwt = require('jsonwebtoken')
const config = require('../config/config')

function getTokenFromHeader (req, key) {
  const authorization = req.headers[key]
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1]
  }
}

module.exports = (req, res, next) => {
  let token = getTokenFromHeader(req, 'authorization')
  if (!token) token = getTokenFromHeader(req, 'x-access-token')
  if (!token) token = req.body.token
  if (!token) token = req.query.token
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.authentication.jwtSecret, function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: true, message: 'Unauthorized access.' })
      }
      req.decoded = decoded
      next()
    })
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ error: true, message: 'No token provided.' })
  }
}
