import moment from 'moment'

export default {
  convertDate2DayString (date) {
    if (!date) return null
    return moment(date).format('YYYY-MM-DD')
  },
  convertDayString2UTCHighNoonDate (day) {
    if (!day) return null
    let isoString = day.substring(0, 10) + 'T12:00:00.000Z'
    const result = new Date(isoString)
    return result
  },
  convertDayString2Millis (day) {
    if (!day) return null
    let isoString = day.substring(0, 10) + 'T12:00:00.000Z'
    const result = new Date(isoString).getTime()
    return result
  },
  /** Returns a date as a string value in ISO format. */
  convertMillisToISOString (millis) {
    if (!millis) return null
    return new Date(millis).toISOString()
  }
}
