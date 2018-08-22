import {
    expect
} from 'chai';
import {
    getOriginalUrl
} from './commandHandler';

describe('commandHandler', () => {
    describe('getOriginalUrl()', () => {
        it('', () => {
            const searchResult = {
                data: [{
                    images: {
                        original: {
                            url: 'originalUrl'
                        }
                    }
                }]
            };
            expect(getOriginalUrl(searchResult)).to.equal('originalUrl');
        })
    })
});