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
    console.log('BKOY:' + JSON.stringify(this.bokey))
    const user = await this.pers.findOne({
      where: {
        id: this.bokey.id
      }
    })

    const plain = user.get({ plain: true })
    console.log('########## plainUSer:' + JSON.stringify(plain))
    const dto = this.extractDtoFromModel(plain, this.bokey)
    console.log('##### und da ist das DTO:' + JSON.stringify(dto))
    return dto
  }

  async setDTO (user) {
    const dto = this.extractDtoFromModel(user, this.bokey)
    console.log('######## curDTO:' + JSON.stringify(dto))
    const oldDTO = await this.getDTO()
    console.log('######## oldDTO:' + JSON.stringify(oldDTO))
    await this.validateDTO(dto, oldDTO)
    await this.pers.update(dto, { where: this.bokey })
  }

  async create (user) {
    console.log('######### CFREATE : ' + JSON.stringify(user))
    const dto = this.extractDtoFromModel(user, this.bokey)
    this.validateCreate(dto)
    console.log('###### und Iatz: ' + JSON.stringify(dto))
    const hashedPasswd = await this.hashPassword(dto.password)
    console.log('#######hashedPWD' + hashedPasswd)
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

  validateCreate (dto) {
    if (dto.password.toString === '') throw new TypeError('passwordMissing')
  }

  async validateDTO (dto, oldDTO) {
    console.log('############# validateDTO:')
    const curpwd = dto.password.toString()
    const oldpwd = oldDTO.password.toString()
    console.log('######### oldpwd:' + oldpwd)
    console.log('######### curpwd:' + curpwd)

    if (curpwd !== oldpwd) {
      const hashedPassword = await this.hashPassword(dto.password)
      dto.password = hashedPassword
      console.log('######### pwd geändert:' + hashedPassword)
    }
    console.log('validateNochNicht implementiert oldPwd:' + oldpwd + '   newPwd:' + curpwd)
  }

  async delete () {
    await this.pers.destroy({ where: this.bokey })
  }
}
module.exports = UserBO
