const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}
const options = config.db.options
options.isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
// https://stackoverflow.com/questions/42870374/node-js-7-how-to-use-sequelize-transaction-with-async-await
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  options
)

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
