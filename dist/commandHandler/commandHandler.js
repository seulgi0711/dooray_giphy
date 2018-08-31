"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require("ramda");

var _giphySearcher = require("../giphySearcher");

var _types = require("../types/types");

var _requestUtil = require("../utils/requestUtil");

// prettier-ignore
var commandHandler = (0, _types.def)("commandHandler :: Object -> Future Object Object", (0, _ramda.pipe)((0, _ramda.prop)("body"), (0, _ramda.cond)([[_requestUtil.isMultiImage, _giphySearcher.searchMultiImages], [_ramda.T, _giphySearcher.searchOneImage]])));

exports.default = commandHandler;
//# sourceMappingURL=commandHandler.js.map