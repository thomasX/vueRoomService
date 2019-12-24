class AbstractBO {
  extractDtoFromModel (model, bokey) {
    const result = model
    for (var vkey in bokey) {
      delete result[vkey]
    }
    return result
  }

  replaceBokeyInModel (model, bokey) {
    const result = this.extractDtoFromModel(model, bokey)
    const transferKeys = Object.keys(bokey)
    transferKeys.forEach(function (key, bokey, result) {
      result[key] = bokey[key]
    })
    return result
  }
}

module.exports = AbstractBO
