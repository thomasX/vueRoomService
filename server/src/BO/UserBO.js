const AbstractBO = require('../BO/AbstractBO')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt'))

class UserBO extends AbstractBO {
  /**
   *
   * @param { id } bokey
   */
  constructor (db, bokey) {
    super()
    this.db = db
    this.pers = db['User']
    this.bokey = bokey
  }

  async getDTO () {
    const user = await this.pers.findOne({
      where: {
        id: this.bokey.id
      }
    })

    const plain = user.get({ plain: true })
    const dto = this.extractDtoFromModel(plain, this.bokey)
    return dto
  }

  async setDTO (user) {
    const dto = this.extractDtoFromModel(user, this.bokey)
    const oldDTO = await this.getDTO()
    await this.validateDTO(dto, oldDTO)
    await this.pers.update(dto, { where: this.bokey })
  }

  async create (user) {
    const dto = this.extractDtoFromModel(user, this.bokey)
    await this.validateCreate(dto)
    const hashedPasswd = await this.hashPassword(dto.password)
    const newModel = this.replaceBokeyInModel(user, this.bokey)
    newModel.password = hashedPasswd
    await this.pers.create(newModel)
  }

  hashPassword (passwd) {
    const SALT_FACTOR = 8
    return bcrypt
      .genSaltAsync(SALT_FACTOR)
      .then(salt => bcrypt.hashSync(passwd, salt, null))
      .then(hash => {
        // user.setDataValue('password', hash)
        return hash
      })
  }

  async comparePasswd (plaintextPasswd, encryptedPasswd) {
    const match = await bcrypt.compare(plaintextPasswd, encryptedPasswd)
    return match
  }

  async validateCreate (dto) {
    if ((dto.password === undefined) || (dto.password.toString === '')) throw new Error('passwordMissing')
  }

  async validateDTO (dto, oldDTO) {
    const curpwd = dto.password.toString()
    const oldpwd = oldDTO.password.toString()

    if (curpwd !== oldpwd) {
      const hashedPassword = await this.hashPassword(dto.password)
      dto.password = hashedPassword
    }
    console.log('validateNochNicht implementiert oldPwd:' + oldpwd + '   newPwd:' + curpwd)
  }

  async delete () {
    await this.pers.destroy({ where: this.bokey })
  }
}
module.exports = UserBO
