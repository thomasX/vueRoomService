import ScreenModel from '@/core/models/screenmodel'

describe('ScreenModel.js Test', () => {
    describe('inner describe', () => {
        const model = new ScreenModel('ID', {'key1': 'value1', 'key5': 'value5'})
        test('Test if ScreenModel.translate(key1) equals value1', () => {
            expect(model.translate('key1')).toBe('value1')
        })
        test('Test if ScreenModel.translate(key5) equals value5', () => {
            expect(model.translate('key5')).toBe('value5')
        })
        test('Test if ScreenModel.translate(key2) equals #key2#', () => {
            expect(model.translate('key2')).toBe('#key2#')
        })
   })
})
