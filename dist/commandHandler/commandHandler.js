"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fluture = require("fluture");

var _fluture2 = _interopRequireDefault(_fluture);

var _ramda = require("ramda");

var _requester = require("../requester/requester");

var _requester2 = _interopRequireDefault(_requester);

var _types = require("../types/types");

var _fnUtil = require("../utils/fnUtil");

var _requestUtil = require("../utils/requestUtil");

var _responseUtil = require("../utils/responseUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actionsAttachmentForOne = (0, _types.def)('actionsAttachmentForOne :: Object -> Object', (0, _ramda.pipe)(_requestUtil.getOriginalUrl, _responseUtil.createSendActionWithValue, _ramda.of, (0, _ramda.append)((0, _responseUtil.createNextAction)(1)), (0, _ramda.objOf)('actions')));

var actionsAttachmentForMulti = {
    actions: [(0, _responseUtil.createNextAction)(1)]
};

// prettier-ignore
var search = (0, _types.def)('search :: Object -> Future Object Object', (0, _ramda.pipe)(_requestUtil.getSearchKeyword, _requester2.default.Giphy.search, (0, _ramda.map)((0, _ramda.converge)(_responseUtil.mergeActionAndImageAttachment, [actionsAttachmentForOne, _responseUtil.createOriginImageAttachment]))));

// prettier-ignore
var searchMulti = (0, _types.def)("searchMulti :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.converge)(_requester2.default.Giphy.searchMulti, [_requestUtil.getSearchKeyword, _requestUtil.extractMultiCount]), (0, _ramda.map)((0, _ramda.converge)(_responseUtil.mergeActionAndImagesAttachments, [(0, _ramda.always)(actionsAttachmentForMulti), _responseUtil.createMultiImageAttachments])), (0, _ramda.map)((0, _fnUtil.logTap)('searchMulti output'))));

var createSearchAttachments = (0, _types.def)('createSearchAttachments :: ReqBody -> Future Object Object', (0, _ramda.pipe)((0, _ramda.converge)(_requester2.default.Giphy.search, [_requestUtil.getSearchKeyword, _requestUtil.extractMultiCount, _requestUtil.extractOffset]), (0, _ramda.map)((0, _ramda.converge)(_ramda.merge, [_responseUtil.createOriginImagesAttachment, (0, _ramda.always)({})])), (0, _ramda.map)(_ramda.of), (0, _ramda.map)((0, _ramda.objOf)('attachments')), (0, _ramda.map)((0, _fnUtil.logTap)('createOriginImagesAttachment'))
// map(converge(merge, [createOriginImageAttachment, createActionsAttachment]))
));

var searchOneImage = (0, _types.def)("searchOneImage :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.juxt)([(0, _ramda.pipe)(_responseUtil.createKeywordText, _fluture2.default.of), createSearchAttachments]), _fluture2.default.parallel(Infinity), (0, _ramda.map)(_ramda.mergeAll)));

var searchMultiImages = (0, _types.def)("searchMultiImages :: Object -> Future Object Object", (0, _ramda.ifElse)((0, _ramda.pipe)(_requestUtil.extractMultiCount, (0, _ramda.equals)(1)), searchOneImage, (0, _ramda.converge)((0, _fnUtil.liftA2)(_ramda.merge), [(0, _ramda.pipe)(_responseUtil.createKeywordText, _fluture2.default.of), searchMulti])));

// prettier-ignore
var commandHandler = (0, _types.def)("commandHandler :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.prop)("body"), (0, _ramda.cond)([[_requestUtil.isMultiImage, searchMultiImages], [_ramda.T, searchOneImage]])));

exports.default = commandHandler;
//# sourceMappingURL=commandHandler.js.map