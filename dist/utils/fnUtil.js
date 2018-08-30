"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wrapValuesWithArray = exports.liftA3 = exports.liftA2 = exports.logTap = exports.wrapWithArray = exports.wrapWithObject = undefined;

var _ramda = require("ramda");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var wrapWithObject = exports.wrapWithObject = (0, _ramda.curry)(function (key, value) {
    return _defineProperty({}, key, value);
});

var wrapWithArray = exports.wrapWithArray = function wrapWithArray(value) {
    return [value];
};

var logTap = exports.logTap = (0, _ramda.curry)(function (label, data) {
    console.log(label, data);
    return data;
});

var liftA2 = exports.liftA2 = (0, _ramda.curry)(function (g, f1, f2) {
    return f1.map(g).ap(f2);
});

var liftA3 = exports.liftA3 = (0, _ramda.curry)(function (g, f1, f2, f3) {
    return f1.map(g).ap(f2).ap(f3);
});

var wrapValuesWithArray = exports.wrapValuesWithArray = function wrapValuesWithArray() {
    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
    }

    return [].concat(values);
};
//# sourceMappingURL=fnUtil.js.map