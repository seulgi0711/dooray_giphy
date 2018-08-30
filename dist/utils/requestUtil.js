"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extractOffset = exports.extractMultiCount = exports.getSearchKeyword = exports.isMultiImage = exports.getFixedHeightSmallUrl = exports.getOriginalUrl = exports.getImageUrl = exports.maybe = undefined;

var _lodash = require("lodash");

var _ramda = require("ramda");

var _ramdaFantasy = require("ramda-fantasy");

var _types = require("../types/types");

var _fnUtil = require("./fnUtil");

var maybe = exports.maybe = (0, _ramda.curry)(function (v, f, m) {
    if (m.isNothing) {
        return v;
    }

    return f(m.value);
});

// prettier-ignore
var getImageUrl = exports.getImageUrl = (0, _types.def)('getImageUrl :: String -> Object -> String', function (imageType, giphy) {
    return giphy.images[imageType].url;
});

// prettier-ignore
var getOriginalUrl = exports.getOriginalUrl = (0, _types.def)("getOriginalUrl :: Object -> String", getImageUrl('original'));

// prettier-ignore
var getFixedHeightSmallUrl = exports.getFixedHeightSmallUrl = (0, _types.def)("getOriginalUrl :: Object -> String", getImageUrl('fixed_height_small'));

// prettier-ignore
var isMultiImage = exports.isMultiImage = (0, _types.def)('isMultiImage :: ReqBody -> Boolean', (0, _ramda.pipe)((0, _ramda.prop)('text'), (0, _ramda.test)(/--multi=/)));

// prettier-ignore
var getSearchKeyword = exports.getSearchKeyword = (0, _types.def)('getSearchKeyword :: ReqBody -> String', (0, _ramda.pipe)((0, _ramda.prop)("text"), _ramda.trim, (0, _ramda.split)(' '), _ramda.head));

// prettier-ignore
var extractMultiCount = exports.extractMultiCount = (0, _types.def)('extractMultiCount :: ReqBody -> Number', (0, _ramda.pipe)((0, _ramda.prop)('text'), (0, _ramda.match)(/--multi=(\d*)/), (0, _ramda.ifElse)(_lodash.isEmpty, _ramdaFantasy.Maybe.Nothing, _ramdaFantasy.Maybe.Just), (0, _ramda.map)((0, _ramda.nth)(1)), (0, _ramda.map)((0, _ramda.min)(5)), (0, _ramda.map)((0, _ramda.max)(1)), maybe(1, _lodash.parseInt)));

// prettier-ignore
var extractOffset = exports.extractOffset = (0, _types.def)("extractOffset :: ReqBody -> Number", (0, _ramda.pipe)((0, _ramda.propOr)("0", "actionValue"), _lodash.parseInt));
//# sourceMappingURL=requestUtil.js.map