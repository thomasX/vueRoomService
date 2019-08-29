module.exports = class UserScrollPersistencyEMAIL {
  createFirstStatement (filter) {
    const statement = 'select * from Users where 1 = 1 #filter# order by email asc Limit 1'
    const filterstatement = this.createFilterstatement(filter)
    statement.replace(/#filter#/, filterstatement)
    return statement
  }

  createLastStatement (filter) {
    const statement = 'select * from Users where 1 = 1 #filter# order by email desc Limit 1'
    const filterstatement = this.createFilterstatement(filter)
    statement.replace(/#filter#/, filterstatement)
    return statement
  }

  createForwardStatement (start, filter, rows) {
    const statement = 'select * from Users where 1 = 1 #filter# order by email asc Limit #rows#'
    const filterstatement = this.createFilterstatement(filter)
    statement.replace(/#filter#/, filterstatement)
    statement.replace(/#rows#/, rows)
    return statement
  }

  createBackwardStatement (start, filter, rows) {
    const statement = 'select * from Users where 1 = 1 #filter# order by email desc Limit #rows#'
    const filterstatement = this.createFilterstatement(filter)
    statement.replace(/#filter#/, filterstatement)
    statement.replace(/#rows#/, rows)
    return statement
  }

  createFilterstatement (filter) {
    let filterstatement = ''
    if ((filter !== undefined) && (filter.length > 0)) {
      filterstatement = 'AND ( ' + filter + ' ) '
    }
    return filterstatement
  }
}
