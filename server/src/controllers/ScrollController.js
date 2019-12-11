const AbstractScrollBO = require('../ScrollBO/AbstractScrollBO')
const ScrollBoFactory = require('../ScrollBO/ScrollBoFactory')
const db = require('../models/index')
// const { User } = require('../models')

module.exports = {
  async getScrollModel (req, res, app) {
    const body = req.body
    let status = 200
    let result = {}
    try {
      const user = await db['User'].findOne({
        where: {
          email: body.email
        }
      })
      const scrollBO = new ScrollBoFactory().createInstance(body.scrollRequest.scrollBO, body.scrollRequest.sort)
      const abstractScrollBO = new AbstractScrollBO(db)
      const scrollRequest = body.scrollRequest
      const response = await abstractScrollBO.getScrollModel(scrollBO, scrollRequest, user)
      result.rawdata = response
      if (result.rawdata.createdWithBackwardDirection === true) result.rawdata.lines = result.rawdata.lines.reverse()
      result.scrollModel = { CurScreenID: scrollRequest.scrollBO }
      result.scrollboClassName = scrollRequest.scrollBO
      result.scrollModel.CurSortCol = scrollBO.scrollableColumns
      result.scrollModel.CurSort = scrollRequest.sort
      result.scrollModel.CurScrollDTO = { NameCollection: [] }
      result.scrollModel.CurScrollDTO.lastDataReached = result.rawdata.lastDataReached
      result.scrollModel.CurScrollDTO.firstDataReached = result.rawdata.firstDataReached
      const linecol = []
      result.rawdata.lines.forEach(line => {
        const orgLine = (line.dataValues === undefined) ? line : line.dataValues
        const convertedLine = {}
        const colNames = Object.keys(orgLine)
        result.scrollModel.CurScrollDTO.NameCollection = colNames
        console.log('orgLine')
        console.log(orgLine)
        colNames.forEach(name => {
          const orgColumn = orgLine[name]
          const convertedCol = (orgColumn['#val#'] !== undefined) ? orgColumn : { '#val#': orgColumn }
          convertedLine[name] = convertedCol
          convertedLine['#lbk#'] = scrollBO.createLinebokey(orgLine)
        })
        linecol.push(convertedLine)
      })
      result.scrollModel.CurScrollDTO.LineCollection = linecol
    } catch (error) {
      result = 'error:' + error
      status = 500
    }
    res.status(status).send(result)
  }
}
