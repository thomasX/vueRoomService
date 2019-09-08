module.exports = class AbstractScrollBO {
  getScrollModel (scrollBO, scrollrequest, user) {
    const lines = collectLines(scrollBO,scrollrequest,user)
    return lines
  }

  async collectLines (scrollBO, scrollrequest, user) {
    let firstDataReached = false
    let lastDataReached = false
    let startingLine = scrollrequest.start
    const forward = scrollrequest.direction
    let result 
    if (forward) {
        if ((startingLine === undefined) || (startingLine === null )) {
          firstDataReached = true
          startingLine = await findFirst(scrollBO, scrollrequest, user)
        }
        if ((startingLine !== undefined) || (startingline === null)) {
          result = await findforward(scrollBO, scrollrequest, user, startingline)
        }
        if ((result === undefined) || (result.length() < 0)) {
          lastDataReached = true
          startingLine = await findLast(scrollBO, scrollrequest, user)
          if ((startingLine === undefined) || (startingLine === null )) {
            result = await findbackward(scrollBO, scrollrequest, user, startingLine)
          }
        }
    } else {
      if ((startingLine === undefined) || (startingLine === null )) {
        lastDataReached = true
        startingLine = await findLast(scrollBO, scrollrequest, user)
      }
      if ((startingLine !== undefined) || (startingline === null)) {
        result = await findbackward(scrollBO, scrollrequest, user, startingline)
      }
      if ((result === undefined) || (result.length() < 0)) {
        firstDataReached = true
        startingLine = await findFirst(scrollBO, scrollrequest, user)
        if ((startingLine === undefined) || (startingLine === null )) {
          result = await findforward(scrollBO, scrollrequest, user, startingLine)
        }
      }
    }
    return lines
  }
  async findFirst (scrollBO, scrollrequest, user) {
    const statement = scrollBO.pers.createFirstStatement(scrollrequest.filter, 1)
    return await find(scrollBO, scrollrequest, user, realStatement)
  }
  async findLast (scrollBO, scrollrequest, user, rows) {
    const statement = scrollBO.pers.createLastStatement(scrollrequest.filter, 1)
    return await find(scrollBO, scrollrequest, user, realStatement)
  }
  async findForward (scrollBO, scrollrequest, user) {
    const statement = scrollBO.pers.createForwardStatement(scrollrequest.filter, scrollrequest.rows)
    return await find(scrollBO, scrollrequest, user, realStatement)
  }
  async findBackward (scrollBO, scrollrequest, user) {
    const statement = scrollBO.pers.createBackwardStatement(scrollrequest.filter, scrollrequest.rows)
    return await find(scrollBO, scrollrequest, user, realStatement)
  }



  find (scrollBO, scrollrequest, user, realStatement) {
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
