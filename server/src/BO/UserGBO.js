const UserBO = require('./UserBO')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt'))

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
    console.log('userbokey:' + JSON.stringify(userBokey))
    const bo = new UserBO(this.db, userBokey)
    const dto = await bo.getDTO()
    console.log('dto:' + JSON.stringify(dto))
    const validPasswd = await this.comparePasswd(passwd, dto.password)
    console.log('validPWD: ' + validPasswd)
    if (!validPasswd) throw new TypeError('ivalidUserOrPasswd')
    return dto
  }

  async comparePasswd (plaintextPasswd, encryptedPasswd) {
    console.log('plainText:' + plaintextPasswd)
    console.log('encryptedPasswd:' + encryptedPasswd)
    const match = await bcrypt.compare(plaintextPasswd, encryptedPasswd)
    return match
  }

  hashPassword (user) {
    const SALT_FACTOR = 8
    return bcrypt
      .genSaltAsync(SALT_FACTOR)
      .then(salt => bcrypt.hashSync(user.password, salt, null))
      .then(hash => {
        user.setDataValue('password', hash)
      })
  }

  async findByEmail (email) {
    const user = await this.pers.findOne({
      where: { email: email }
    })
    if ((!user) || (user === null)) throw new TypeError('invalidUser')
    const result = { id: user.id }
    console.log('result:' + JSON.stringify(result))
    return result
  }
}

module.exports = UserGBO
