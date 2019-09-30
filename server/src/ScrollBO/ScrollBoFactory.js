const ScrollBObyName = {
  UserScrollBO: require('./User/UserScrollBO')
  // ...
}
module.exports = class ScrollBoFactory {
  createInstance (name, sortcol) {
    const ScrollBoClass = ScrollBObyName[name]
    const scrollbo = new ScrollBoClass()
    scrollbo.pers = scrollbo.createScrollPersistency(sortcol)
    return scrollbo
  }

}
