const AuthenticationController = require('../../controllers/AuthenticationController')
// const AuthenticationControllerPolicy = require('./polices/AuthenticationControllerPolicy')
const UsermaintenanceCtrl = require('../../controllers/UsermaintenanceCtrl')
const auth = require('../auth')

module.exports = (app) => {
  app.post('/api/user/register', auth.optional, AuthenticationController.register)

  app.post('/api/user/create', auth.required, UsermaintenanceCtrl.createUser)

  app.put('/api/user/update', auth.required, UsermaintenanceCtrl.updateUser)

  app.post('/api/user/login', auth.optional, AuthenticationController.login)

  app.get('/api/user/activeAdminUserExists', auth.optional, AuthenticationController.activeAdminUserExists)

  app.get('/api/user/:id', auth.optional, UsermaintenanceCtrl.getUser)
}
