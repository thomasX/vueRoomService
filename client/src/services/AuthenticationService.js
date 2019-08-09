import Api from '@/services/Api'

export default {
  register (user) {
    return Api().post('register', user)
  },
  login (credentials) {
    return Api().post('login', credentials)
  },
  noActiveUsers () {
    return Api().get('noActiveUsers')
  }

}