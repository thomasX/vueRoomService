
// import scrollCtrl from './controllers/ScrollController'
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./polices/AuthenticationControllerPolicy')

module.exports = (app) => {
  app.post('/User/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)

  app.post('/User/login', AuthenticationController.login)

  app.get('/User/activeAdminUserExists', AuthenticationController.activeAdminUserExists)

  // app.get('/Scroll/getScrollModel/:scrollBO', scrollCtrl.getScrollModel)
}
