import { getSearchKeyword } from './requestUtil';

describe('getSearchKeyword(reqBody)', () => {
    test('asdasd', () => {
        expect(getSearchKeyword({text: '', responseUrl: '', command: ''})).toEqual('');
        expect(getSearchKeyword({text: '--multi=5', responseUrl: '', command: ''})).toEqual('');
    });
});
