const ScrollBObyName = {
  UserScrollBO: require('./UserScrollBO')
  // ...
}
module.exports = {
  createInstance (name) {
    return new ScrollBObyName[name]()
  }
}
