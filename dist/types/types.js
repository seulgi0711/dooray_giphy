"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.def = undefined;

var _fluture = require("fluture");

var _fluture2 = _interopRequireDefault(_fluture);

var _hmDef = require("hm-def");

var _hmDef2 = _interopRequireDefault(_hmDef);

var _ramda = require("ramda");

var _sanctuaryDef = require("sanctuary-def");

var _sanctuaryDef2 = _interopRequireDefault(_sanctuaryDef);

var _sanctuaryTypeIdentifiers = require("sanctuary-type-identifiers");

var _sanctuaryTypeIdentifiers2 = _interopRequireDefault(_sanctuaryTypeIdentifiers);

var _constant = require("../constant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkTypeId = (0, _ramda.curry)(function (expectedType, obj) {
    var eq = function eq(fn) {
        return (0, _ramda.compose)((0, _ramda.equals)(expectedType), fn);
    };
    return (0, _ramda.anyPass)([eq((0, _ramda.path)(["constructor", "prototype", "@@type"])), eq(_sanctuaryTypeIdentifiers2.default)])(obj);
});

var $Future = _sanctuaryDef2.default.BinaryType(_sanctuaryTypeIdentifiers2.default.parse(_fluture2.default["@@type"]).name, "https://github.com/fluture-js/Fluture#readme", _fluture2.default.isFuture, _fluture2.default.extractLeft, _fluture2.default.extractRight);

var ActionType = _sanctuaryDef2.default.EnumType("DoorayGiphy", "", ["button"]);

var ButtonType = _sanctuaryDef2.default.EnumType("DoorayGiphy/ButtonType", "", (0, _ramda.values)(_constant.BUTTON_TYPE));

var Button = _sanctuaryDef2.default.NullaryType("Button", "", (0, _ramda.propEq)("type", "button"));

var InChannelResponse = _sanctuaryDef2.default.NullaryType("DoorayGiphy/InChannelResponse", "", (0, _ramda.propEq)("responseType", _constant.RESPONSE_TYPE.IN_CHANNEL));

var ReplaceResponse = _sanctuaryDef2.default.NullaryType("DoorayGiphy/ReplaceResponse", "", (0, _ramda.propEq)("deleteOriginal", true));

var ReqBody = _sanctuaryDef2.default.NullaryType("DoorayGiphy/ReqBody", "", (0, _ramda.allPass)([(0, _ramda.has)('channelId'), (0, _ramda.has)('responseUrl'), (0, _ramda.has)('command'), (0, _ramda.has)('text')]));

var def = exports.def = _hmDef2.default.create({
    checkTypes: true,
    env: _sanctuaryDef2.default.env.concat([$Future(_sanctuaryDef2.default.Unknown, _sanctuaryDef2.default.Unknown), Button, ButtonType, InChannelResponse, ReplaceResponse, ReqBody])
});
//# sourceMappingURL=types.js.map