const AuthenticationSrvCtrl = require('../../serverController/AuthenticationSrvCtrl')
// const AuthenticationControllerPolicy = require('./polices/AuthenticationControllerPolicy')
const UsermaintenanceSrvCtrl = require('../../serverController/UsermaintenanceSrvCtrl')
const auth = require('../auth')

module.exports = (app) => {
  app.post('/api/user/register', auth.optional, AuthenticationSrvCtrl.register)

  app.post('/api/user/create', auth.required, UsermaintenanceSrvCtrl.createUser)

  app.put('/api/user/update', auth.required, UsermaintenanceSrvCtrl.updateUser)

  app.post('/api/user/login', auth.optional, AuthenticationSrvCtrl.login)

  app.post('/api/user/refreshToken', auth.optional, AuthenticationSrvCtrl.refreshToken)

  app.get('/api/user/activeAdminUserExists', auth.optional, AuthenticationSrvCtrl.activeAdminUserExists)

  app.get('/api/user/:id', auth.optional, UsermaintenanceSrvCtrl.getUser)
}
