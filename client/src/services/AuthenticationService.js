import Api from '@/services/Api'

export default {
  register (user) {
    return new Api().post('api/user/register',undefined, user)
  },
  login (credentials) {
    return new Api().post('api/user/login', undefined, credentials)
  },
  activeAdminUserExists () {
    return new Api().get('api/user/activeAdminUserExists')
  }
}