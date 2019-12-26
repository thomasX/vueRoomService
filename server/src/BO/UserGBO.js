const UserBO = require('./UserBO')

class UserGBO {
  constructor (db) {
    this.db = db
    this.pers = db['User']
  }

  /**
   *
   * @param {*} email
   * @param {*} passwd
   * @return { user: userJson, token: jwtToken }
   */
  async login (email, passwd) {
    const userBokey = await this.findByEmail(email)
    const bo = new UserBO(this.db, userBokey)
    const dto = await bo.getDTO()
    const validPasswd = await bo.comparePasswd(passwd, dto.password)
    const result = { key: userBokey, value: dto }
    if (!validPasswd) throw new TypeError('ivalidUserOrPasswd')
    return result
  }

  async createUser (dto) {
    new UserBO(this.db, { id: 0 }).create(dto)
  }

  async activeAdminUserExists () {
    const user = await this.pers.findOne({
      where: { admin: true }
    })
    const result = ((user) && (user !== null))
    return result
  }

  async findByEmail (email) {
    const user = await this.pers.findOne({
      where: { email: email }
    })
    if ((!user) || (user === null)) throw new TypeError('invalidUser')
    const result = { id: user.id }
    return result
  }
}

module.exports = UserGBO
