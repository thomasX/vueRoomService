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
      new Api().put('User/update',undefined, user)
    } catch (error) {
      return alert('user not found  ....#######.....##### ' + error)
    }
  },
  async create (user) {
    try {
      return new Api().post('User/create',undefined, user)
    } catch (error) {
      return alert('cannot save user' +error) 
    }
  }
}
