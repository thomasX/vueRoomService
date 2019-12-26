class AbstractBO {
  extractDtoFromModel (model, bokey) {
    const result = {}
    const arrA = Object.keys(model)
    const arrB = Object.keys(bokey)
    const difference = arrA.filter(x => !arrB.includes(x))
    difference.forEach(x => {
      result[x] = model[x]
    })
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
