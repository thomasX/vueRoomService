const ScrollPersistency = {
  email: require('./UserScrollPersistencyEMAIL')
}
module.exports = (db) => class UserScrollBO {
  createScrollPersistency (sortCol) {
    this.pers = new ScrollPersistency[sortCol]()
    this.pers.model = db.models.User
  }
}
