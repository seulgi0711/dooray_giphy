'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getOriginalUrl = exports.searchGiphy = undefined;

var _fluture = require('fluture');

var _fluture2 = _interopRequireDefault(_fluture);

var _ramda = require('ramda');

var _requester = require('../requester');

var _requester2 = _interopRequireDefault(_requester);

var _fnUtil = require('../utils/fnUtil');

var _types = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchGiphy = exports.searchGiphy = (0, _types.def)('searchGiphy :: String -> Future Object Object', function (keyword) {
    return (0, _fluture2.default)(function (rej, res) {
        _requester2.default.Giphy.search(keyword).then((0, _ramda.pipe)((0, _ramda.prop)('data'), res)).catch(rej);
    });
});

// export const searchGiphy = (keyword) => {
//     return Future((rej, res) => {
//         requester.Giphy.search(keyword).then(pipe(prop('data'), res)).catch(rej);
//     });
// }

var appendAddButton = (0, _ramda.append)({
    "actions": [{
        "name": "send",
        "text": "보내기(미구현)",
        "type": "button",
        "value": "send"
    }]
});

var getOriginalUrl = exports.getOriginalUrl = function getOriginalUrl(a) {
    return (0, _ramda.pipe)((0, _ramda.prop)('data'), _ramda.head, (0, _ramda.path)(['images', 'original', 'url']))(a);
};

var makeResponseMessageForDooray = (0, _ramda.pipe)(getOriginalUrl, (0, _fnUtil.wrapWithObject)('imageUrl'), _fnUtil.wrapWithArray, appendAddButton, (0, _fnUtil.wrapWithObject)('attachments'));

var makeKeywordText = (0, _ramda.pipe)((0, _ramda.prop)('text'), (0, _ramda.concat)('\''), (0, _ramda.flip)(_ramda.concat)('\'에 대한 검색 결과'), (0, _fnUtil.wrapWithObject)('text'));

// search :: Obj -> Future [Obj]
var search = (0, _ramda.pipe)((0, _ramda.prop)('text'), searchGiphy);

var dooray = function dooray(body) {
    return (0, _ramda.pipe)(search, (0, _ramda.map)(makeResponseMessageForDooray), (0, _ramda.map)((0, _ramda.merge)(makeKeywordText(body))))(body);
};

exports.default = {
    dooray: dooray
};
//# sourceMappingURL=commandHandler.js.map