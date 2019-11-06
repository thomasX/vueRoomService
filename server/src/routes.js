
const scrollCtrl = require('./controllers/ScrollController')
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./polices/AuthenticationControllerPolicy')
const UsermaintenanceCtrl = require('./controllers/UsermaintenanceCtrl')

module.exports = (app) => {
  app.post('/User/register',
    AuthenticationControllerPolicy.validateUser,
    AuthenticationController.register)

  app.post('/User/createUser',
    AuthenticationControllerPolicy.validateUser,
    UsermaintenanceCtrl.createUser)

  app.post('/User/updateUser',
    AuthenticationControllerPolicy.validateUser,
    UsermaintenanceCtrl.updateUser)

  app.post('/User/login', AuthenticationController.login)

  app.get('/User/activeAdminUserExists', AuthenticationController.activeAdminUserExists)

  app.get('/User/:id', UsermaintenanceCtrl.getUser)

  app.put('/Scroll/ScrollModel', scrollCtrl.getScrollModel)
}
