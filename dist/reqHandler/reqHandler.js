"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSearchResult = exports.createSearchAttachments = exports.mergeSearchAttachments = exports.search = exports.createSendResult = undefined;

var _fluture = require("fluture");

var _fluture2 = _interopRequireDefault(_fluture);

var _lodash = require("lodash");

var _ramda = require("ramda");

var _requester = require("../requester/requester");

var _requester2 = _interopRequireDefault(_requester);

var _types = require("../types/types");

var _actionUtil = require("../utils/actionUtil");

var _requestUtil = require("../utils/requestUtil");

var _responseUtil = require("../utils/responseUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createSendResult = exports.createSendResult = (0, _types.def)("createSendResult :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.prop)("originalMessage"), (0, _ramda.pick)(["text", "attachments"]), (0, _ramda.evolve)({ attachments: (0, _ramda.take)(1) }), _responseUtil.createInChannelResponse, _responseUtil.createReplaceResponse, _fluture2.default.of));

var search = exports.search = (0, _types.def)("search :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.converge)(_requester2.default.Giphy.searchWithOffset, [_requestUtil.getSearchKeyword, _requestUtil.extractOffset]), (0, _ramda.map)(_responseUtil.createOriginImageAttachment)));

var mergeSearchAttachments = exports.mergeSearchAttachments = (0, _types.def)("mergeSearchAttachments :: Future Object Object -> Object -> Future Object Object", function (searchResult, actionsAttachments) {
    return searchResult.map((0, _responseUtil.mergeActionAndImageAttachment)(actionsAttachments));
});

var createSearchAttachments = exports.createSearchAttachments = (0, _types.def)("createSearchAttachments :: Object -> Future Object Object", (0, _ramda.converge)(mergeSearchAttachments, [search, _responseUtil.createActions]));

// prettier-ignore
var createSearchResult = exports.createSearchResult = (0, _types.def)("createSearchResult :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.juxt)([_responseUtil.createKeywordText, createSearchAttachments]), _fluture2.default.parallel(Infinity), (0, _ramda.map)(_ramda.mergeAll)));

// prettier-ignore
var reqHandler = (0, _types.def)("reqHandler :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.prop)("body"), (0, _ramda.cond)([[_actionUtil.isSendButton, createSendResult], [_actionUtil.isSearchButton, createSearchResult], [_ramda.T, _fluture2.default.of({ text: 'nono' })]])));

exports.default = reqHandler;
//# sourceMappingURL=reqHandler.js.map