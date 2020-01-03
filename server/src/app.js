const express = require('express')
// const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const { sequelize } = require('./models')
const config = require('./config/config.js')
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }))
app.use(cors())
require('./config/passport')
require('./routes/api')(app)

sequelize.sync()
  .then(() => {
    try {
      app.listen(config.port)
      console.log(`server started on port: ${config.port}`)
    } catch (error) {
      console.log('error ...:' + error)
    }
  })
