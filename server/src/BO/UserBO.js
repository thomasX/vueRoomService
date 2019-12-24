const AbstractBO = require('../BO/AbstractBO')

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
    const dto = this.extractDtoFromModel(user, this.bokey)
    return dto
  }

  async setDTO (user) {
    const dto = this.extractDtoFromModel(user, this.bokey)
    const oldDTO = this.getDTO()
    this.validateDTO(dto, oldDTO)
    await this.pers.update(dto, { where: this.bokey })
  }

  async create (user) {
    const dto = this.extractDtoFromModel(user, this.bokey)
    this.validateCreate(dto)
    const newModel = this.replaceBokeyInModel(user, this.bokey)
    await this.pers.create(newModel)
  }

  validateCreate (dto) {
    if (dto.password.toString === '') throw new TypeError('passwordMissing')
  }

  validateDTO (dto, oldDTO) {
    const curpwd = dto.password.toString()
    const oldpwd = oldDTO.password.toString()
    if (!curpwd === oldpwd) this.gbo.hashPassword(dto)

    console.log('validateNochNicht implementiert oldPwd:' + oldpwd + '   newPwd:' + curpwd)
  }

  async delete () {
    await this.pers.destroy({ where: this.bokey })
  }
}
module.exports = UserBO
