"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createKeywordText = exports.createOriginImagesAttachment = exports.createMultiImageAttachments = exports.createOriginImageAttachment = exports.mergeActionAndImagesAttachments = exports.mergeActionAndImageAttachment = exports.createReplaceResponse = exports.createInChannelResponse = exports.createActions = exports.createPrevActions = exports.createNextActions = exports.createNextAction = exports.createSendActionWithValue = exports.createSendAction = exports.createPrevAction = undefined;

var _lodash = require("lodash");

var _ramda = require("ramda");

var _constant = require("../constant");

var _types = require("../types/types");

var _actionUtil = require("./actionUtil");

var _fnUtil = require("./fnUtil");

var _requestUtil = require("./requestUtil");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var createPrevAction = exports.createPrevAction = (0, _types.def)("createPrevAction :: Number -> Object", (0, _ramda.assoc)("value", _ramda.__, {
    name: _constant.BUTTON_TYPE.PREV,
    text: "이전 이미지",
    type: _constant.ACTION_TYPE.BUTTON
}));

var createSendAction = exports.createSendAction = (0, _types.def)("createSendAction :: Undefined -> Object", (0, _ramda.always)({
    name: _constant.BUTTON_TYPE.SEND,
    text: "대화방으로 보내기",
    type: _constant.ACTION_TYPE.BUTTON,
    value: _constant.BUTTON_TYPE.SEND
}));

var createSendActionWithValue = exports.createSendActionWithValue = (0, _types.def)("createSendActionWithValue :: String -> Object", (0, _ramda.assoc)("value", _ramda.__, {
    name: _constant.BUTTON_TYPE.SEND,
    text: "대화방으로 보내기",
    type: _constant.ACTION_TYPE.BUTTON
}));

var createNextAction = exports.createNextAction = (0, _types.def)("createNextAction :: Number -> Object", (0, _ramda.assoc)("value", _ramda.__, {
    name: _constant.BUTTON_TYPE.NEXT,
    text: "다음 이미지",
    type: _constant.ACTION_TYPE.BUTTON
}));

var createNextActions = exports.createNextActions = (0, _types.def)("createNextActions :: Object -> Object", (0, _ramda.pipe)((0, _ramda.prop)("actionValue"), _lodash.parseInt, (0, _ramda.juxt)([(0, _ramda.pipe)(_ramda.dec, createPrevAction), (0, _ramda.pipe)((0, _ramda.always)(undefined), createSendAction), (0, _ramda.pipe)(_ramda.inc, createNextAction)]), (0, _ramda.objOf)("actions")));

var createPrevActions = exports.createPrevActions = (0, _types.def)("createPrevActions :: Object -> Object", (0, _ramda.pipe)((0, _ramda.prop)("actionValue"), _lodash.parseInt, (0, _ramda.juxt)([(0, _ramda.when)((0, _ramda.gt)(_ramda.__, 0), (0, _ramda.pipe)(_ramda.dec, createPrevAction)), (0, _ramda.pipe)((0, _ramda.always)(undefined), createSendAction), (0, _ramda.pipe)(_ramda.inc, createNextAction)]), (0, _ramda.reject)(_lodash.isEmpty), (0, _fnUtil.wrapWithObject)("actions")));

var createActions = exports.createActions = (0, _types.def)("createActions :: Object -> Object", (0, _ramda.ifElse)(_actionUtil.isNextButton, createNextActions, createPrevActions));

var createInChannelResponse = exports.createInChannelResponse = (0, _types.def)("createInChannelResponse :: Object -> InChannelResponse", (0, _ramda.merge)(_ramda.__, { responseType: "inChannel" }));

var createReplaceResponse = exports.createReplaceResponse = (0, _types.def)("createReplaceResponse :: Object -> ReplaceResponse", (0, _ramda.merge)(_ramda.__, { deleteOriginal: true }));

var mergeActionAndImageAttachment = exports.mergeActionAndImageAttachment = (0, _types.def)("mergeActionAndImageAttachment :: Object -> Object -> Object", function (actionsAttachment, imageAttachment) {
    return {
        attachments: [imageAttachment, actionsAttachment]
    };
});

var mergeActionAndImagesAttachments = exports.mergeActionAndImagesAttachments = (0, _types.def)("mergeActionAndImagesAttachments :: Object -> [Object] -> Object", function (actionsAttachment, imagesAttachments) {
    return {
        attachments: [].concat(_toConsumableArray(imagesAttachments), [actionsAttachment])
    };
});

// prettier-ignore
var createOriginImageAttachment = exports.createOriginImageAttachment = (0, _types.def)("createOriginImageAttachment :: Object -> Object", (0, _ramda.pipe)((0, _fnUtil.logTap)('start'), _requestUtil.getOriginalUrl, (0, _fnUtil.logTap)('getOriginUrl'), (0, _ramda.objOf)("imageUrl"), (0, _fnUtil.logTap)('test')));

// prettier-ignore
var createMultiImageAttachments = exports.createMultiImageAttachments = (0, _types.def)("createMultiImageAttachments :: [Object] -> [Object]", (0, _ramda.map)((0, _ramda.pipe)(_requestUtil.getFixedHeightSmallUrl, (0, _ramda.converge)(_ramda.merge, [(0, _ramda.objOf)("thumbUrl"), (0, _ramda.pipe)(createSendActionWithValue, _ramda.of, (0, _ramda.objOf)("actions"))]))));

// prettier-ignore
var createOriginImagesAttachment = exports.createOriginImagesAttachment = (0, _types.def)('createOriginImagesAttachment :: [Object] -> Object', (0, _ramda.ifElse)((0, _ramda.pipe)(_ramda.length, (0, _ramda.equals)(1)), (0, _ramda.pipe)(_ramda.head, createOriginImageAttachment), createMultiImageAttachments));

var createKeywordText = exports.createKeywordText = (0, _types.def)("createKeywordText :: Object -> Object", (0, _ramda.pipe)(_requestUtil.getSearchKeyword, (0, _fnUtil.logTap)("text"), (0, _ramda.concat)("'"), (0, _ramda.flip)(_ramda.concat)("'에 대한 검색 결과"), (0, _ramda.objOf)("text")));
//# sourceMappingURL=responseUtil.js.map