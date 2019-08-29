const ScrollBObyName = {
  UserScrollBO: require('./User/UserScrollBO')
  // ...
}
module.exports = class ScrollBoFactory {
  createInstance (name) {
    return new ScrollBObyName[name]()
  }
}
