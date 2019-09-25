module.exports = class UserScrollPersistencyEMAIL {
  createFirstStatement (filter) {
    let statement = 'select * from Users where 1 = 1 #filter# order by email asc Limit #rows#'
    const filterstatement = this.createFilterstatement(filter)
    statement = statement.replace(/#filter#/, filterstatement)
    return statement
  }

  createLastStatement (filter) {
    let statement = 'select * from Users where 1 = 1 #filter# order by email desc Limit #rows#'
    const filterstatement = this.createFilterstatement(filter)
    statement = statement.replace(/#filter#/, filterstatement)
    return statement
  }

  createForwardStatement (start, filter, rows) {
    let statement = 'select * from Users where 1 = 1 #filter# order by email asc Limit #rows#'
    const filterstatement = this.createFilterstatement(filter)
    statement = statement.replace(/#filter#/, filterstatement)
    statement = statement.replace(/#rows#/, rows)
    return statement
  }

  createBackwardStatement (start, filter, rows) {
    let statement = 'select * from Users where 1 = 1 #filter# order by email desc Limit #rows#'
    const filterstatement = this.createFilterstatement(filter)
    statement = statement.replace(/#filter#/, filterstatement)
    statement = statement.replace(/#rows#/, rows)
    return statement
  }

  createFilterstatement (filter) {
    let filterstatement = ''
    if ((filter !== undefined) && (filter.length > 0)) {
      filterstatement = 'AND ( ' + filter + ' ) '
    }
    console.log('filterstatement:' + filterstatement)
    return filterstatement
  }
}
