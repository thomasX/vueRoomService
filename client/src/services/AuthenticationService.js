import Api from '@/services/Api'

export default {
  register (user) {
    return Api().post('User/register', user)
  },
  login (credentials) {
    return Api().post('User/login', credentials)
  },
  activeAdminUserExists () {
    return Api().get('User/activeAdminUserExists')
  }

}