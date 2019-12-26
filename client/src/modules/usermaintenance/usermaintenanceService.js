import Api from '@/services/Api'


export default {
  async read (bokey) {
    try {
       const user = await new Api().get(`User/${bokey}`)
      return user
    } catch {
      return alert('user not found')
    }
  },
  async update (bokey, dto) {
    try {
      new Api().put('User/update',undefined, { bokey: bokey , dto: dto })
    } catch (error) {
      return alert('user not found  ....#######.....##### ' + error)
    }
  },
  async create (bokey, dto) {
    try {
      return new Api().post('User/create',undefined, { bokey: bokey, dto: dto })
    } catch (error) {
      return alert('cannot save user' +error) 
    }
  }
}
