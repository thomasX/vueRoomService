
export default class Room {
  constructor (rawdata) {
    this.id = rawdata.id
    this.description = rawdata.description
    this.maxPersons = rawdata.maxPersons
    this.category = rawdata.category
  }
}
