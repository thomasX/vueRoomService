import Api from '@/services/Api'


export default {
  async read (id) {
    try {
       const user = await new Api().get(`User/${id}`)
      return user
    } catch {
      return alert('user not found')
    }
  },
  async update (user) {
    try {
      new Api().post('User/update',undefined, user)
    } catch {
      return alert('user not found')
    }
  },
  async create (user) {
    try {
      return new Api().post('User/create',undefined, user)
    } catch {
      return alert('cannot save user')
    }
  }
}
