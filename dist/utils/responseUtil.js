"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSendAction = exports.createKeywordText = exports.createThumbImageAttachment = exports.createOriginImageAttachment = exports.mergeActionAndImageAttachment = exports.createReplaceResponse = exports.createInChannelResponse = exports.createActions = exports.createPrevActions = exports.createNextActions = exports.createNextAction = exports.createPrevAction = undefined;

var _lodash = require("lodash");

var _ramda = require("ramda");

var _constant = require("../constant");

var _types = require("../types/types");

var _actionUtil = require("./actionUtil");

var _fnUtil = require("./fnUtil");

var _requestUtil = require("./requestUtil");

var createPrevAction = exports.createPrevAction = (0, _types.def)("createPrevAction :: Number -> Object", (0, _ramda.assoc)("value", _ramda.__, {
    name: _constant.BUTTON_TYPE.PREV,
    text: "이전 이미지",
    type: _constant.ACTION_TYPE.BUTTON
}));

var createNextAction = exports.createNextAction = (0, _types.def)("createNextAction :: Number -> Object", (0, _ramda.assoc)("value", _ramda.__, {
    name: _constant.BUTTON_TYPE.NEXT,
    text: "다음 이미지",
    type: _constant.ACTION_TYPE.BUTTON
}));

// prettier-ignore
var createNextActions = exports.createNextActions = (0, _types.def)("createNextActions :: Number -> Object", (0, _ramda.pipe)((0, _fnUtil.logTap)('offset'), (0, _ramda.juxt)([(0, _ramda.when)((0, _ramda.gt)(_ramda.__, 0), (0, _ramda.pipe)(_ramda.dec, createPrevAction)), (0, _ramda.pipe)(_ramda.inc, createNextAction)]), (0, _ramda.reject)(_lodash.isEmpty), (0, _ramda.objOf)("actions")));

// prettier-ignore
var createPrevActions = exports.createPrevActions = (0, _types.def)("createPrevActions :: Number -> Object", (0, _ramda.pipe)((0, _ramda.juxt)([(0, _ramda.when)((0, _ramda.gt)(_ramda.__, 0), (0, _ramda.pipe)(_ramda.dec, createPrevAction)), (0, _ramda.pipe)(_ramda.inc, createNextAction)]), (0, _ramda.reject)(_lodash.isEmpty), (0, _fnUtil.wrapWithObject)("actions")));

var createActions = exports.createActions = (0, _types.def)("createActions :: ReqBody -> Object", (0, _ramda.ifElse)(_actionUtil.isNextButton, createNextActions, createPrevActions));

var createInChannelResponse = exports.createInChannelResponse = (0, _types.def)("createInChannelResponse :: Object -> InChannelResponse", (0, _ramda.merge)(_ramda.__, { responseType: "inChannel" }));

var createReplaceResponse = exports.createReplaceResponse = (0, _types.def)("createReplaceResponse :: Object -> ReplaceResponse", (0, _ramda.merge)(_ramda.__, { deleteOriginal: true }));

var mergeActionAndImageAttachment = exports.mergeActionAndImageAttachment = (0, _types.def)("mergeActionAndImageAttachment :: Object -> Object -> Object", function (actionsAttachment, imageAttachment) {
    return {
        attachments: [imageAttachment, actionsAttachment]
    };
});

// prettier-ignore
var createOriginImageAttachment = exports.createOriginImageAttachment = (0, _types.def)("createOriginImageAttachment :: Object -> Object", (0, _ramda.pipe)(_requestUtil.getOriginalUrl, (0, _ramda.objOf)("imageUrl")));

// prettier-ignore
var createThumbImageAttachment = exports.createThumbImageAttachment = (0, _types.def)("createOriginImageAttachment :: Object -> Object", (0, _ramda.pipe)(_requestUtil.getOriginalUrl, (0, _ramda.objOf)("thumbUrl")));

var createKeywordText = exports.createKeywordText = (0, _types.def)("createKeywordText :: Object -> Object", (0, _ramda.pipe)(_requestUtil.getSearchKeyword, (0, _ramda.concat)("'"), (0, _ramda.flip)(_ramda.concat)("'에 대한 검색 결과"), (0, _ramda.objOf)("text")));

var createSendAction = exports.createSendAction = (0, _types.def)('createSendAction :: Number -> Object', (0, _ramda.assoc)("value", _ramda.__, {
    name: _constant.BUTTON_TYPE.SEND,
    text: "대화방으로 보내기",
    type: _constant.ACTION_TYPE.BUTTON
}));
//# sourceMappingURL=responseUtil.js.map