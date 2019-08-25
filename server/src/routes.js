
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./polices/AuthenticationControllerPolicy')
const ScrollCtrl = require('./controllers/ScrollController')

module.exports = (app) => {
  app.post('/User/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)

  app.post('/User/login', AuthenticationController.login)

  app.get('/User/activeAdminUserExists', AuthenticationController.activeAdminUserExists)

  app.get('/Scroll/getScrollModel/:scrollBO', ScrollCtrl.getScrollModel)
}
