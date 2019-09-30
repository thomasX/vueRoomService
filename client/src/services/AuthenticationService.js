import Api from '@/services/Api'

export default {
  register (user) {
    return new Api().post('User/register', user)
  },
  login (credentials) {
    return new Api().post('User/login', credentials)
  },
  activeAdminUserExists () {
    return new Api().get('User/activeAdminUserExists')
  }

}