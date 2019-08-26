const ScrollPersistency = {
    email: require('./UserScrollPersistencyEMAIL')
    // ...
  }

module.exports = {
  createScrollPersistency (sortCol) {
    return new ScrollPersistency[sortcol]()
  },
  getScrollModel(scrollrequest, user){
    const sortcol=scrollrequest.sort
    const pers = new ScrollPersistency[sortcol]()
    
  }
}
