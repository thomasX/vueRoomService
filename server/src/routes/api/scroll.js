const auth = require('../auth')
const scrollCtrl = require('../../controllers/ScrollController')
module.exports = (app) => {
  app.put('/api/scroll/ScrollModel', auth.required, scrollCtrl.getScrollModel)
}
