const ScrollPersistency = {
  email: require('./UserScrollPersistencyEMAIL'),
  models: require('../models')
  // ...
}
module.exports = class UserScrollBO {
  createScrollPersistency (sortCol) {
    this.pers = new ScrollPersistency[sortCol]()
    this.pers.model = models.User
  }
}
