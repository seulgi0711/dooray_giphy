'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wrapWithArray = exports.wrapWithObject = undefined;

var _ramda = require('ramda');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var wrapWithObject = exports.wrapWithObject = (0, _ramda.curry)(function (key, value) {
    return _defineProperty({}, key, value);
});

var wrapWithArray = exports.wrapWithArray = function wrapWithArray(value) {
    return [value];
};
//# sourceMappingURL=fnUtil.js.map