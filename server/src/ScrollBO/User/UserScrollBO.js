const ScrollPersistency = {
  email: require('./UserScrollPersistencyEMAIL')
}

module.exports = class UserScrollBO {
  constructor () {
    this.modelName = 'User'
    this.scrollableColumns = Object.keys(ScrollPersistency)
  }

  createScrollPersistency (sortCol) {
    const PersClass = ScrollPersistency[sortCol]
    const pers = new PersClass()
    return pers
  }
}
