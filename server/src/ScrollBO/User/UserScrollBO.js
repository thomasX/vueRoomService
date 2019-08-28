const ScrollPersistency = {
  email: require('./UserScrollPersistencyEMAIL')
  // ...
}
export default class UserScrollBO {
  createScrollPersistency (sortCol) {
    return new ScrollPersistency[sortCol]()
  }

  getScrollModel (scrollrequest, user) {
    const sortcol = scrollrequest.sort
    const pers = new ScrollPersistency[sortcol]()
    console.log(pers)
  }
}
