'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _fluture = require('fluture');

var _fluture2 = _interopRequireDefault(_fluture);

var _ramda = require('ramda');

var _fnUtil = require('../utils/fnUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _search = function _search(q) {
    var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    console.log('q', q);
    console.log('limit', limit);
    console.log('offset', offset);
    return (0, _fluture2.default)(function (rej, res) {
        _axios2.default.get("http://api.giphy.com/v1/gifs/search", {
            params: {
                api_key: "8JyP74RbDTroHrzNyXt8zaAWkBeIe81l",
                fmt: "json",
                lang: "ko",
                q: q,
                limit: limit,
                offset: offset
            }
        }).then((0, _ramda.pipe)((0, _ramda.path)(['data', 'data']), res)).catch(rej);
    });
};

var Giphy = {
    search: function search(q, limit, offset) {
        return _search(q, limit, offset);
    }
};

exports.default = {
    Giphy: Giphy
};
//# sourceMappingURL=requester.js.map