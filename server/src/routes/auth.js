const withAccessToken = require('./withAccessToken')
const withRefreshToken = require('./withRefreshToken')
const withoutAccessToken = require('./withoutAccessToken')

const auth = {
  required: withAccessToken,
  optional: withoutAccessToken,
  requireRefreshToken: withRefreshToken
}

module.exports = auth
