'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _ramda = require('ramda');

var _commandHandler = require('./commandHandler/commandHandler');

var _commandHandler2 = _interopRequireDefault(_commandHandler);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({
    extended: false
}));
app.use(_bodyParser2.default.json());

app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function (req, res) {
    res.type('text/plain');
    res.send('Test');
});

app.post('/giphy', function (req, res) {
    (0, _ramda.pipe)((0, _ramda.prop)('body'), _commandHandler2.default.dooray)(req).value(function (result) {
        return res.send(result);
    });
});

var getImgaeUrlFromAttachments = (0, _types.def)('getImgaeUrlFromAttachments :: Array -> String', (0, _ramda.pipe)(_ramda.head, (0, _ramda.prop)('imageUrl')));

app.post('/req', function (req, res) {
    var originalMessage = req.body.originalMessage;

    res.send({
        "responseType": "inChannel",
        "deleteOriginal": true,
        text: originalMessage.text,
        attachments: (0, _ramda.take)(1, req.body.originalMessage.attachments)
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started on ' + app.get('port'));
});
//# sourceMappingURL=index.js.map