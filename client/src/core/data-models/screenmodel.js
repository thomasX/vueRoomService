export default class Screenmodel {
  constructor (id, rawdata) {
    this.id = id
    try {
      this.translationMap = rawdata.data.serviceResult.ScreenStrings
    } catch {
      //console.log('invalidScreenmodel')
    }
    if ((this.translationMap === undefined) || (this.translationMap === null)) this.translationMap = { title: 'FERPS-VUE' }
    this.untranslatedMap = {}
  }
  translate (untranslatedKey) {
    if (this.translationMap[untranslatedKey] !== undefined) {
      return this.translationMap[untranslatedKey]
    } else {
      let untranslated = '#' + untranslatedKey + '#'
      this.untranslatedMap[untranslatedKey] = untranslated
      return untranslated
    }
  }
  translateToolTip (untranslatedKey) {
    return this.translationMap[untranslatedKey + '.ToolTip']
  }
}
 