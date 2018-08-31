"use strict";

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _commandHandler = require("./commandHandler/commandHandler");

var _commandHandler2 = _interopRequireDefault(_commandHandler);

var _reqHandler = require("./reqHandler/reqHandler");

var _reqHandler2 = _interopRequireDefault(_reqHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({
    extended: false
}));
app.use(_bodyParser2.default.json());

app.set("port", process.env.PORT || 3000);

app.use(function (req, res, next) {
    res.locals.showTests = app.get("env") !== "production" && req.query.test === "1";
    next();
});

app.get("/", function (req, res) {
    res.type("text/plain");
    res.send("Test");
});

app.post("/giphy", function (req, res) {
    (0, _commandHandler2.default)(req).value(function (result) {
        return res.send(result);
    });
});

app.post("/req", function (req, res) {
    (0, _reqHandler2.default)(req).fork(console.error, function (result) {
        return res.send(result);
    });
});

app.listen(app.get("port"), function () {
    console.log("Server started on " + app.get("port"));
});
//# sourceMappingURL=index.js.map