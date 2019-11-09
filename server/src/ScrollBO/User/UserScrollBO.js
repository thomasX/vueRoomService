const ScrollPersistency = {
  email: require('./UserScrollPersistencyEMAIL'),
  id: require('./UserScrollPersistencyID')
}

module.exports = class UserScrollBO {
  constructor () {
    this.modelName = 'User'
    this.scrollableColumns = { email: '', id: '' }
  }

  createScrollPersistency (sortCol) {
    const PersClass = ScrollPersistency[sortCol]
    const pers = new PersClass()
    return pers
  }

  createLinebokey (line) {
    const id = line.id
    return { id: id }
  }
}
