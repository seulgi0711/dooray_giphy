import { extractSearchKeyword } from './requestUtil';

describe('extractSearchKeyword(reqBody)', () => {
    test('asdasd', () => {
        expect(extractSearchKeyword({text: '', responseUrl: '', command: ''})).toEqual('');
        expect(extractSearchKeyword({text: '--multi=5', responseUrl: '', command: ''})).toEqual('');
    });
});
