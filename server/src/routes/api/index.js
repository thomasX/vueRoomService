module.exports = (app) => {
  require('./user')(app)
  require('./scroll')(app)
}
