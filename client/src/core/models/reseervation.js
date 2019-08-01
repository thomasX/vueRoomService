
export default class Reservation {
  constructor (rawdata) {
    this.id = rawdata.id
    this.roomID = rawdata.roomID
    this.start = rawdata.start
    this.stop = rawdata.stop
    this.customerName = rawdata.customerName
    this.persons = rawdata.persons
    this.extranote = rawdata.extranote
  }
}
