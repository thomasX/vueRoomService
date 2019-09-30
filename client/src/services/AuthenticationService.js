import Api from '@/services/Api'

export default {
  register (user) {
    return new Api().post('User/register',undefined, user)
  },
  login (credentials) {
    return new Api().post('User/login', undefined, credentials)
  },
  activeAdminUserExists () {
    return new Api().get('User/activeAdminUserExists')
  }

}