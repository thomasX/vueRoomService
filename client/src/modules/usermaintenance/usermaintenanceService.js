import Api from '@/services/Api'


export default {
  async read (bokey) {
    try {
       const user = await new Api().get(`User/${bokey}`)
      return user
    } catch (error) {
      return alert('user not found' + JSON.stringify(error))
    }
  },
  async update (bokey, dto) {
    try {
      await new Api().put('User/update',undefined, { bokey: bokey , dto: dto })
    } catch (error) {
      throw(error.response.data)
    }
  },
  async create (bokey, dto) {
    try{
      const result =  await new Api().post('User/create',undefined, { bokey: bokey, dto: dto })
      return result
    } catch (error) {
      throw(error.response.data)
    }
  }
}
