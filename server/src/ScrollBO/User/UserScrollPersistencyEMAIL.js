module.exports = class UserScrollPersistencyEMAIL {
  createFirstStatement (filter) {
    let statement = 'select * from Users where 1 = 1 #filter# order by email asc Limit #rows# '
    const filterstatement = this.createFilterstatement(filter)
    statement = statement.replace(/#filter#/, filterstatement)
    statement = statement.replace(/#rows#/, 1)
    console.log('firstStatement: ' + statement)
    return { statement: statement, replacements: [] }
  }

  createLastStatement (filter) {
    let statement = 'select * from Users where 1 = 1 #filter# order by email desc Limit #rows# '
    const filterstatement = this.createFilterstatement(filter)
    statement = statement.replace(/#filter#/, filterstatement)
    statement = statement.replace(/#rows#/, 1)
    console.log('lastStatement: ' + statement)
    return { statement: statement, replacements: [] }
  }

  createForwardStatement (start, filter, rows) {
    console.log('start:' + JSON.stringify(start))
    let statement = 'select * from Users where id >= ? #filter# order by email asc Limit #rows# '
    const filterstatement = this.createFilterstatement(filter)
    statement = statement.replace(/#filter#/, filterstatement)
    statement = statement.replace(/#rows#/, rows)
    console.log('forwardStatement: ' + statement + '### rows:' + rows)
    const startcol = this.extractColumnValue(start['id'])
    return { statement: statement, replacements: [startcol] }
  }

  extractColumnValue (column) {
    return (column['#val#'] !== undefined) ? column['#val#'] : column
  }

  createBackwardStatement (start, filter, rows) {
    console.log('start:' + JSON.stringify(start))
    let statement = 'select * from Users where id <= ? #filter# order by email desc Limit #rows# '
    const filterstatement = this.createFilterstatement(filter)
    statement = statement.replace(/#filter#/, filterstatement)
    statement = statement.replace(/#rows#/, rows)
    console.log('backwardStatement: ' + statement)
    const startcol = this.extractColumnValue(start['id'])
    return { statement: statement, replacements: [startcol] }
  }

  createFilterstatement (filter) {
    let filterstatement = ''
    if ((filter !== undefined) && (filter.length > 0)) {
      filterstatement = 'AND ( ' + filter + ' ) '
    }
    console.log('filterstatement:' + filterstatement + '##')
    return filterstatement
  }
}
