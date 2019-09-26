module.exports = (db) => class AbstractScrollBO {
  constructor (db) {
    this.db = db
  }

  async collectLines (scrollBO, scrollrequest, userCtxt) {
    let startingLine = scrollrequest.start
    const forward = scrollrequest.direction
    console.log('Ahaaaaaa:' + scrollrequest)
    const result = { firstDataReached: false, lastDataReached: false, lines: [] }
    if (forward) {
      if ((startingLine === undefined) || (startingLine === null)) {
        result.firstDataReached = true
        startingLine = await this.findFirst(scrollBO, scrollrequest, userCtxt)
      }
      if ((startingLine !== undefined) || (startingLine === null)) {
        result.lines = await this.findforward(scrollBO, scrollrequest, userCtxt, startingLine)
      }
      if ((result === undefined) || (result.lines.length < 0)) {
        result.lastDataReached = true
        startingLine = await this.findLast(scrollBO, scrollrequest, userCtxt)
        if ((startingLine === undefined) || (startingLine === null)) {
          result.lines = await this.findbackward(scrollBO, scrollrequest, userCtxt, startingLine)
        }
      }
    } else {
      if ((startingLine === undefined) || (startingLine === null)) {
        result.lastDataReached = true
        startingLine = await this.findLast(scrollBO, scrollrequest, userCtxt)
      }
      if ((startingLine !== undefined) || (startingLine === null)) {
        result.lines = await this.findbackward(scrollBO, scrollrequest, userCtxt, startingLine)
      }
      if ((result === undefined) || (result.lines.length < 0)) {
        result.firstDataReached = true
        startingLine = await this.findFirst(scrollBO, scrollrequest, userCtxt)
        if ((startingLine === undefined) || (startingLine === null)) {
          result.lines = await this.findforward(scrollBO, scrollrequest, userCtxt, startingLine)
        }
      }
    }
    return result
  }

  async findFirst (scrollBO, scrollrequest, userCtxt) {
    const realStatement = scrollBO.pers.createFirstStatement(scrollrequest.filter, 1)
    return this.find(scrollBO, scrollrequest, userCtxt, realStatement)
  }

  async findLast (scrollBO, scrollrequest, userCtxt, rows) {
    const realStatement = scrollBO.pers.createLastStatement(scrollrequest.filter, 1)
    return this.find(scrollBO, scrollrequest, userCtxt, realStatement)
  }

  async findForward (scrollBO, scrollrequest, userCtxt) {
    const realStatement = scrollBO.pers.createForwardStatement(scrollrequest.filter, scrollrequest.rows)
    return this.find(scrollBO, scrollrequest, userCtxt, realStatement)
  }

  async findBackward (scrollBO, scrollrequest, userCtxt) {
    const realStatement = scrollBO.pers.createBackwardStatement(scrollrequest.filter, scrollrequest.rows)
    return this.find(scrollBO, scrollrequest, userCtxt, realStatement)
  }

  async find (scrollBO, scrollrequest, userCtxt, realStatement) {
    db.sequelize
      .query(realStatement, {
        model: scrollBO.pers.model,
        mapToModel: true
      })
      .then(queryResult => {
        return queryResult
      })
      .catch(error => {
        console.log('######## abstractscrollBO_Error' + error)
      })
  }

  getScrollModel (scrollBO, scrollrequest, userCtxt) {
    console.log('#ä############ ' + scrollrequest)
    const lines = this.collectLines(scrollBO, scrollrequest, userCtxt)
    return lines
  }
}
