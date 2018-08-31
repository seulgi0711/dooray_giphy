"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = exports.createSendResult = exports.pickAttachmentForSend = exports.convertThumbToImageUrl = exports.removeActions = undefined;

var _fluture = require("fluture");

var _fluture2 = _interopRequireDefault(_fluture);

var _lodash = require("lodash");

var _ramda = require("ramda");

var _giphySearcher = require("../giphySearcher");

var _requester = require("../requester/requester");

var _requester2 = _interopRequireDefault(_requester);

var _types = require("../types/types");

var _actionUtil = require("../utils/actionUtil");

var _fnUtil = require("../utils/fnUtil");

var _requestUtil = require("../utils/requestUtil");

var _responseUtil = require("../utils/responseUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeActions = exports.removeActions = (0, _types.def)('removeActions :: Object -> Object', (0, _ramda.dissoc)('actions'));

var convertThumbToImageUrl = exports.convertThumbToImageUrl = (0, _types.def)('convertThumbToImageUrl :: Object -> Object', (0, _fnUtil.rename)({ thumbUrl: 'imageUrl' }));

// prettier-ignore
var pickAttachmentForSend = exports.pickAttachmentForSend = (0, _types.def)('pickAttachmentForSend :: Number -> [Object] -> [Object]', function (targetImageIndex, attachments) {
    return (0, _ramda.pipe)((0, _ramda.slice)(targetImageIndex, targetImageIndex + 1), (0, _ramda.converge)((0, _ramda.update)(0), [(0, _ramda.pipe)(_ramda.head, removeActions, convertThumbToImageUrl), _ramda.identity]))(attachments);
});

var createSendResult = exports.createSendResult = (0, _types.def)("createSendResult :: ReqBody -> Future Object Object", function (reqBody) {
    (0, _ramda.pipe)((0, _ramda.prop)("originalMessage"), (0, _ramda.pick)(["text", "attachments"]), (0, _ramda.evolve)({ attachments: pickAttachmentForSend((0, _lodash.parseInt)((0, _actionUtil.getActionValue)(reqBody))) }), (0, _fnUtil.logTap)('evolve({ attachments: pickAttachmentForSend(parseInt(getActionValue(reqBody))) })')
    // logTap('attachments'),
    // createInChannelResponse,
    // createReplaceResponse,
    // Future.of
    )(reqBody);

    return (0, _ramda.pipe)((0, _ramda.prop)("originalMessage"), (0, _ramda.pick)(["text", "attachments"]), (0, _ramda.evolve)({ attachments: pickAttachmentForSend((0, _lodash.parseInt)((0, _actionUtil.getActionValue)(reqBody))) }), (0, _fnUtil.logTap)('attachments'), _responseUtil.createInChannelResponse, _responseUtil.createReplaceResponse, _fluture2.default.of)(reqBody);
});

var search = exports.search = (0, _types.def)("search :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.converge)(_requester2.default.Giphy.searchWithOffset, [_requestUtil.getSearchKeyword, _requestUtil.extractOffset]), (0, _ramda.map)(_responseUtil.createOriginImageAttachment)));

// prettier-ignore
var reqHandler = (0, _types.def)("reqHandler :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.prop)("body"), (0, _ramda.cond)([[_actionUtil.isSendButton, createSendResult], [_actionUtil.isSearchButton, _giphySearcher.searchOneImage], [_ramda.T, _fluture2.default.of({ text: 'nono' })]])));

exports.default = reqHandler;
//# sourceMappingURL=reqHandler.js.map