const ScrollPersistency = {
  email: require('./UserScrollPersistencyEMAIL')
}

module.exports = class UserScrollBO {
  constructor () {
    this.modelName = 'User'
  }

  createScrollPersistency (sortCol) {
    const PersClass = ScrollPersistency[sortCol]
    const pers = new PersClass()
    return pers
  }
}
