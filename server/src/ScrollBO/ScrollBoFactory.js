const ScrollBObyName = {
  UserScrollBO: require('./User/UserScrollBO')
  // ...
}
module.exports = class ScrollBoFactory {
  createInstance (name) {
    console.log('##############' + name)
    return ScrollBObyName[name]
  }
}
