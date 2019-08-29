const ScrollPersistency = {
  email: require('./UserScrollPersistencyEMAIL')
  // ...
}
module.exports = class UserScrollBO {
  createScrollPersistency (sortCol) {
    this.pers = new ScrollPersistency[sortCol]()
  }
}
