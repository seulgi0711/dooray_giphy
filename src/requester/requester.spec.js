import requester from './requester';

describe('search', () => {
    test('asd', async () => {
        const result = await requester.Giphy.search('풍선');
        expect(true).toEqual(false);
    });
});