import Api from '@/services/Api'


export default {
  async read (bokey) {
    try {
       const user = await new Api().get(`api/user/${bokey}`)
      return user
    } catch (error) {
      throw(error.response.data)
    }
  },
  async delete (store, bokey) {
    try {
       const user = await new Api(store).putAuthorized('api/user/delete', undefined,{ bokey: bokey })
      return user
    } catch (error) {
      throw(error.response.data)
    }
  },
  async update (store, bokey, dto) {
    try {
      const result = await new Api(store).putAuthorized('api/user/update',undefined, { bokey: bokey, dto: dto })
      return result
    } catch (error) {
      throw(error.response.data)
    }
  },
  async create (store, bokey, dto) {
    try{
      const result =  await new Api(store).postAuthorized('api/user/create',undefined, { bokey: bokey, dto: dto })
      return result
    } catch (error) {
      throw(error.response.data)
    }
  }
}
