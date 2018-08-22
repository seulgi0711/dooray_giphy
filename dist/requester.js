'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Giphy = {
    search: function search(q) {
        return _axios2.default.get('http://api.giphy.com/v1/gifs/search', {
            params: {
                api_key: '8JyP74RbDTroHrzNyXt8zaAWkBeIe81l',
                q: q,
                limit: 1,
                offset: 0,
                fmt: 'json'
            }
        });
    }
};

exports.default = {
    Giphy: Giphy
};
//# sourceMappingURL=requester.js.map