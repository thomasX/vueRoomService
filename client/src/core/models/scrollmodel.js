export default class Scrollmodel {
    constructor (title, headers,lines,sortcolumnname) {
      this.title = title
      this.headers = headers
      this.lines = lines
      this.pagination = {
          sortBy: sortcolumnname
      }
    }
}