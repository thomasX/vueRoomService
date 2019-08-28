const ScrollBObyName = {
  UserScrollBO: require('./User/UserScrollBO')
  // ...
}
export default class ScrollBoFactory {
  createInstance (name) {
    return new ScrollBObyName[name]()
  }
}
