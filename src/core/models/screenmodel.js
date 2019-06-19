export default class Screenmodel {
  constructor (id, translationMap) {
    this.id = id
    this.translationMap = translationMap
    this.untranslatedMap = {}
  }
  translate (id) {
    if (this.translationMap[id] !== undefined) {
      return this.translationMap[id]
    } else {
      let untranslated = '#' + id + '#'
      this.untranslatedMap[id] = untranslated
      return untranslated
    }
  }
}
