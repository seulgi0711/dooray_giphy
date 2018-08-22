'use strict';

var _chai = require('chai');

var _commandHandler = require('./commandHandler');

describe('commandHandler', function () {
    describe('getOriginalUrl()', function () {
        it('', function () {
            var searchResult = {
                data: [{
                    images: {
                        original: {
                            url: 'originalUrl'
                        }
                    }
                }]
            };
            (0, _chai.expect)((0, _commandHandler.getOriginalUrl)(searchResult)).to.equal('originalUrl');
        });
    });
});
//# sourceMappingURL=commandHandler.spec.js.map