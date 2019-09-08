module.exports = class AbstractScrollBO {
  getScrollModel (scrollBO, scrollrequest, user) {
    const lines = collectLines(scrollBO,scrollrequest,user)
    return lines
  }

  collectLines (scrollBO, scrollrequest, user) {
    let firstDataReached = false
    let lastDataReached = false
    let startingLine = scrollrequest.start
    const forward = scrollrequest.direction
    let result 
    if (forward) {
        if ((startingLine === undefined) || (startingLine === null ) {
          firstDataReached = true
          startingLine = findFirst(scrollBO, scrollrequest, user)
        }
        if (startingLine !== undefined) {
          result = findforward(scrollBO, scrollrequest, user, startingline))
        }
    } else {

    }
    return lines
  }
  
}
