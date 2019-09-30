module.exports = class AbstractScrollBO {
  constructor (db) {
    this.db = db
  }

  async collectLines (scrollBO, scrollrequest, userCtxt) {
    console.log('############# BIN IM collectlines')
    let startingLine = scrollrequest.start
    const forward = scrollrequest.direction
    console.log('##############Ahaaaaaa:' + JSON.stringify(scrollrequest))
    const result = { firstDataReached: false, lastDataReached: false, lines: [] }
    if (forward) {
      if ((startingLine === undefined) || (startingLine === null)) {
        result.firstDataReached = true
        startingLine = await this.findFirst(scrollBO, scrollrequest, userCtxt)
        console.log('firstLine gefunden:' + startingLine)
      }
      if ((startingLine !== undefined) || (startingLine === null)) {
        console.log('######################### suche forward')
        result.lines = await this.findForward(scrollBO, scrollrequest, userCtxt, startingLine)
        console.log('forward gefunden:' + result.lines)
      }
      if ((result === undefined) || (result.lines.length < 0)) {
        result.lastDataReached = true
        startingLine = await this.findLast(scrollBO, scrollrequest, userCtxt)
        if ((startingLine === undefined) || (startingLine === null)) {
          result.lines = await this.findBackward(scrollBO, scrollrequest, userCtxt, startingLine)
        }
      }
    } else {
      if ((startingLine === undefined) || (startingLine === null)) {
        result.lastDataReached = true
        startingLine = await this.findLast(scrollBO, scrollrequest, userCtxt)
      }
      if ((startingLine !== undefined) || (startingLine === null)) {
        result.lines = await this.findBackward(scrollBO, scrollrequest, userCtxt, startingLine)
      }
      if ((result === undefined) || (result.lines.length < 0)) {
        result.firstDataReached = true
        startingLine = await this.findFirst(scrollBO, scrollrequest, userCtxt)
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
    console.log('SCROLLREQUEST: ' + JSON.stringify(scrollrequest) + '############### rows: ' + scrollrequest.rows)
    const realStatement = scrollBO.pers.createForwardStatement(startingLine, scrollrequest.filter, scrollrequest.rows)
    console.log(' ####### forwardStatement:' + realStatement)
    const forwardResult = await this.find(scrollBO, scrollrequest, userCtxt, realStatement)
    return forwardResult
  }

  async findBackward (scrollBO, scrollrequest, userCtxt, startingLine) {
    const realStatement = scrollBO.pers.createBackwardStatement(startingLine, scrollrequest.filter, scrollrequest.rows)
    const backwardResult = await this.find(scrollBO, scrollrequest, userCtxt, realStatement)
    return backwardResult
  }

  async find (scrollBO, scrollrequest, userCtxt, realStatement) {
    console.log('bin im find:')
    console.log('bin im find: ' + realStatement + '  _____   ' + scrollBO.modelName + '     db:' + this.db)
    const queryResult = await this.db.sequelize.query(realStatement, { model: this.db[scrollBO.modelName], mapToModel: true })
    console.log('################# und da????' + JSON.stringify(queryResult))
    return queryResult
  }

  async getScrollModel (scrollBO, scrollrequest, userCtxt) {
    console.log('################# bin im Abstractscrollbo.colletlines...')
    console.log('#ä############ ' + scrollrequest)
    const lines = this.collectLines(scrollBO, scrollrequest, userCtxt)
    return lines
  }
}
