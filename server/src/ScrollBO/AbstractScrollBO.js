module.exports = class AbstractScrollBO {
  constructor (db) {
    this.db = db
  }

  async collectLines (scrollBO, scrollrequest, userCtxt) {
    let startingLine = scrollrequest.start
    const forward = scrollrequest.direction
    const result = { firstDataReached: false, lastDataReached: false, lines: [] }
    if (forward) {
      if ((startingLine === undefined) || (startingLine === null)) {
        result.firstDataReached = true
        const response = await this.findFirst(scrollBO, scrollrequest, userCtxt)
        startingLine = response[0]
      }
      if ((startingLine !== undefined) || (startingLine === null)) {
        result.lines = await this.findForward(scrollBO, scrollrequest, userCtxt, startingLine)
      }
      if ((result === undefined) || (result.lines.length < 0)) {
        result.lastDataReached = true
        const response = await this.findLast(scrollBO, scrollrequest, userCtxt)
        startingLine = response[0]
        if ((startingLine === undefined) || (startingLine === null)) {
          result.lines = await this.findBackward(scrollBO, scrollrequest, userCtxt, startingLine)
        }
      }
    } else {
      if ((startingLine === undefined) || (startingLine === null)) {
        result.lastDataReached = true
        const response = await this.findLast(scrollBO, scrollrequest, userCtxt)
        startingLine = response[0]
      }
      if ((startingLine !== undefined) || (startingLine === null)) {
        result.lines = await this.findBackward(scrollBO, scrollrequest, userCtxt, startingLine)
      }
      if ((result === undefined) || (result.lines.length < 0)) {
        result.firstDataReached = true
        const response = await this.findFirst(scrollBO, scrollrequest, userCtxt)
        startingLine = response[0]
        if ((startingLine === undefined) || (startingLine === null)) {
          result.lines = await this.findForward(scrollBO, scrollrequest, userCtxt, startingLine)
        }
      }
    }
    return result
  }

  async findFirst (scrollBO, scrollrequest, userCtxt) {
    const realStatement = scrollBO.pers.createFirstStatement(scrollrequest.filter, 1)
    const firstResult = await this.find(scrollBO, scrollrequest, userCtxt, realStatement)
    return firstResult
  }

  async findLast (scrollBO, scrollrequest, userCtxt, rows) {
    const realStatement = scrollBO.pers.createLastStatement(scrollrequest.filter, 1)
    const lastResult = await this.find(scrollBO, scrollrequest, userCtxt, realStatement)
    return lastResult
  }

  async findForward (scrollBO, scrollrequest, userCtxt, startingLine) {
    const realStatement = scrollBO.pers.createForwardStatement(startingLine, scrollrequest.filter, scrollrequest.rows)
    const forwardResult = await this.find(scrollBO, scrollrequest, userCtxt, realStatement)
    return forwardResult
  }

  async findBackward (scrollBO, scrollrequest, userCtxt, startingLine) {
    const realStatement = scrollBO.pers.createBackwardStatement(startingLine, scrollrequest.filter, scrollrequest.rows)
    const backwardResult = await this.find(scrollBO, scrollrequest, userCtxt, realStatement)
    return backwardResult
  }

  async find (scrollBO, scrollrequest, userCtxt, realStatement) {
    const queryResult = await this.db.sequelize.query(realStatement.statement, { model: this.db[scrollBO.modelName], mapToModel: true, replacements: realStatement.replacements })
    return queryResult
  }

  async getScrollModel (scrollBO, scrollrequest, userCtxt) {
    const lines = this.collectLines(scrollBO, scrollrequest, userCtxt)
    return lines
  }
}
