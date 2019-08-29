module.exports = class AbstractScrollBO {
  getScrollModel (scrollBO, scrollrequest, user) {
    const lines = collectLines(scrollBO,scrollrequest,user)
    return lines
  }

  collectLines (scrollBO, scrollrequest, user) {
    let firstDataReached = false
    let lastDataReached = false
    let startingLine = scrollrequest.start
    if (scrollrequest.direction === true) {
        if ((startingLine === undefined) || (startingLine === null ) {
          startingLine = findFirst(scrollBO,scrollrequest,user)
          firstDataReached = true
        }
        ...
    } else {

    }
    return lines
  }
}
