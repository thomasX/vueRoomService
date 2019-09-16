module.exports = class AbstractScrollBO {
  getScrollModel (scrollBO, scrollrequest, userCtxt) {
    const lines = collectLines(scrollBO,scrollrequest,userCtxt)
    return lines
  }

  async collectLines (scrollBO, scrollrequest, userCtxt) {
    let firstDataReached = false
    let lastDataReached = false
    let startingLine = scrollrequest.start
    const forward = scrollrequest.direction
    let result 
    if (forward) {
        if ((startingLine === undefined) || (startingLine === null )) {
          firstDataReached = true
          startingLine = await findFirst(scrollBO, scrollrequest, userCtxt)
        }
        if ((startingLine !== undefined) || (startingline === null)) {
          result = await findforward(scrollBO, scrollrequest, userCtxt, startingline)
        }
        if ((result === undefined) || (result.length() < 0)) {
          lastDataReached = true
          startingLine = await findLast(scrollBO, scrollrequest, userCtxt)
          if ((startingLine === undefined) || (startingLine === null )) {
            result = await findbackward(scrollBO, scrollrequest, userCtxt, startingLine)
          }
        }
    } else {
      if ((startingLine === undefined) || (startingLine === null )) {
        lastDataReached = true
        startingLine = await findLast(scrollBO, scrollrequest, userCtxt)
      }
      if ((startingLine !== undefined) || (startingline === null)) {
        result = await findbackward(scrollBO, scrollrequest, userCtxt, startingline)
      }
      if ((result === undefined) || (result.length() < 0)) {
        firstDataReached = true
        startingLine = await findFirst(scrollBO, scrollrequest, userCtxt)
        if ((startingLine === undefined) || (startingLine === null )) {
          result = await findforward(scrollBO, scrollrequest, userCtxt, startingLine)
        }
      }
    }
    return lines
  }
  async findFirst (scrollBO, scrollrequest, userCtxt) {
    const statement = scrollBO.pers.createFirstStatement(scrollrequest.filter, 1)
    return await find(scrollBO, scrollrequest, userCtxt, realStatement)
  }
  async findLast (scrollBO, scrollrequest, userCtxt, rows) {
    const statement = scrollBO.pers.createLastStatement(scrollrequest.filter, 1)
    return await find(scrollBO, scrollrequest, userCtxt, realStatement)
  }
  async findForward (scrollBO, scrollrequest, userCtxt) {
    const statement = scrollBO.pers.createForwardStatement(scrollrequest.filter, scrollrequest.rows)
    return await find(scrollBO, scrollrequest, userCtxt, realStatement)
  }
  async findBackward (scrollBO, scrollrequest, userCtxt) {
    const statement = scrollBO.pers.createBackwardStatement(scrollrequest.filter, scrollrequest.rows)
    return await find(scrollBO, scrollrequest, userCtxt, realStatement)
  }



  find (scrollBO, scrollrequest, userCtxt, realStatement) {
    sequelize
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

}
