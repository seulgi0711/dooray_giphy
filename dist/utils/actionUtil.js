"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getActionValue = exports.isSearchButton = exports.isPrevButton = exports.isNextButton = exports.isSendButton = undefined;

var _ramda = require("ramda");

var _constant = require("../constant");

var _types = require("../types/types");

var isSendButton = exports.isSendButton = (0, _types.def)("isSendButton :: Object -> Boolean", (0, _ramda.propEq)("actionName", _constant.BUTTON_TYPE.SEND));

var isNextButton = exports.isNextButton = (0, _types.def)("isNextButton :: Object -> Boolean", (0, _ramda.propEq)("actionName", _constant.BUTTON_TYPE.NEXT));

var isPrevButton = exports.isPrevButton = (0, _types.def)("isSearchButton :: Object -> Boolean", (0, _ramda.propEq)("actionName", _constant.BUTTON_TYPE.PREV));

var isSearchButton = exports.isSearchButton = (0, _types.def)('isSearchButton :: Object -> Boolean', (0, _ramda.either)(isNextButton, isPrevButton));

var getActionValue = exports.getActionValue = (0, _types.def)('getActionValue :: ReqBody -> String', (0, _ramda.prop)('actionValue'));
//# sourceMappingURL=actionUtil.js.map