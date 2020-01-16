const auth = require('../auth')
const scrollSrvCtrl = require('../../serverController/ScrollSrvCtrl')
module.exports = (app) => {
  app.put('/api/scroll/ScrollModel', auth.required, scrollSrvCtrl.getScrollModel)
}
